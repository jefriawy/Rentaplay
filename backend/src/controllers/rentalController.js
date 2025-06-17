// backend/src/controllers/rentalController.js

const { db } = require('../config/firebase');

// Fungsi untuk mengecek ketersediaan PS5
const checkAvailability = async (req, res) => {
  try {
    const { unit_id, tanggal_mulai, jam_mulai, durasi } = req.body;

    if (!unit_id || !tanggal_mulai || !jam_mulai || !durasi || Number(durasi) <= 0) {
      return res.status(400).json({ message: 'Detail ketersediaan (unit_id, tanggal, jam, durasi) wajib diisi.' });
    }

    const ps5UnitRef = db.collection('ps5_units').doc(unit_id);
    const ps5Doc = await ps5UnitRef.get();

    if (!ps5Doc.exists) {
      return res.status(404).json({ message: 'Unit PS5 tidak ditemukan.' });
    }

    // Pastikan status PS5 adalah 'Tersedia'
    if (ps5Doc.data().status !== 'Tersedia') {
      return res.status(409).json({ message: `Unit PS5 ini berstatus '${ps5Doc.data().status}', tidak tersedia untuk disewa.` });
    }

    // Logika dasar untuk mengecek bentrokan jadwal (ini bisa lebih kompleks)
    // Untuk pembelajaran, kita akan menyederhanakan:
    // Cek apakah ada rental lain untuk unit ini yang statusnya 'Sedang Disewa' atau 'Reserved'
    // yang tumpang tindih dengan waktu yang diminta.
    // Ini hanya contoh sederhana, implementasi nyata butuh perhitungan tanggal/jam yang akurat.

    // Menggabungkan tanggal dan jam mulai menjadi objek Date
    const startDateTime = new Date(`${tanggal_mulai}T${jam_mulai}:00`);
    const endDateTime = new Date(startDateTime.getTime() + durasi * 60 * 60 * 1000); // durasi dalam jam

    const conflictingRentalsSnapshot = await db.collection('rentals')
      .where('unit_id', '==', unit_id)
      .where('status', 'in', ['Sedang Disewa', 'Reserved', 'Dikonfirmasi & Menunggu Pengiriman', 'Dalam Pengiriman'])
      .get();

    let isConflict = false;
    conflictingRentalsSnapshot.forEach(doc => {
      const rental = doc.data();
      // Perhitungan tumpang tindih waktu yang lebih akurat
      const existingRentalStart = new Date(`${rental.tanggal_mulai}T${rental.jam_mulai}:00`);
      const existingRentalEnd = new Date(existingRentalStart.getTime() + rental.durasi * 60 * 60 * 1000);

      // Cek tumpang tindih
      if (startDateTime < existingRentalEnd && endDateTime > existingRentalStart) {
        isConflict = true;
      }
    });

    if (isConflict) {
        return res.status(409).json({ message: 'Unit PS5 sudah dipesan untuk sebagian atau seluruh periode yang diminta.' });
    }

    res.status(200).json({ message: 'Unit PS5 tersedia untuk periode yang diminta.' });

  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ message: 'Gagal mengecek ketersediaan.', error: error.message });
  }
};

// Fungsi untuk membuat pesanan sewa baru
const createRental = async (req, res) => {
  try {
    const { 
      user_id, 
      unit_id, 
      tanggal_mulai, 
      jam_mulai, 
      durasi, 
      alamat_pengiriman, 
      nomor_kontak, 
      total_biaya,
    } = req.body;

    // Validasi input
    if (!user_id || !unit_id || !tanggal_mulai || !jam_mulai || !durasi || !alamat_pengiriman.jalan || !nomor_kontak || !total_biaya) {
      return res.status(400).json({ message: 'Semua detail pemesanan wajib diisi.' });
    }

    // Pastikan PS5 memang tersedia sebelum membuat rental (re-check)
    const ps5UnitRef = db.collection('ps5_units').doc(unit_id);
    const ps5Doc = await ps5UnitRef.get();
    if (!ps5Doc.exists || ps5Doc.data().status !== 'Tersedia') {
      return res.status(409).json({ message: 'Unit PS5 tidak tersedia atau statusnya berubah.' });
    }

    const confirmationExpiresAt = new Date(new Date().getTime() + 30 * 60 * 1000);

    // Buat objek rental baru
    const newRental = {
      user_id,
      unit_id,
      tanggal_mulai,
      jam_mulai,
      durasi: Number(durasi),
      alamat_pengiriman,
      nomor_kontak,
      total_biaya: Number(total_biaya),
      status: 'Menunggu Konfirmasi', // Status awal
      transaction_id: '', // Akan diisi setelah proses pembayaran dummy/nyata
      created_at: new Date(),
      updated_at: new Date(),
      konfirmasi_kadaluarsa_at: confirmationExpiresAt,
      waktu_mulai_sewa: null, // Akan diisi saat status 'Sedang Disewa'
      waktu_selesai_sewa: null, // Akan diisi saat status 'Selesai'
      catatan_admin: '' // Catatan dari admin
    };

    const docRef = await db.collection('rentals').add(newRental);

    // Opsional: Ubah status PS5 menjadi 'Reserved' atau 'Menunggu Pembayaran'
    await ps5UnitRef.update({ 
        status: 'Reserved', 
        updated_at: new Date() 
    });

    res.status(201).json({ 
      message: 'Pesanan berhasil dibuat! Menunggu konfirmasi dari admin.', 
      rental: { id: docRef.id, ...newRental } 
    });

  } catch (error) {
    console.error('Error creating rental:', error);
    res.status(500).json({ message: 'Gagal membuat pesanan sewa.', error: error.message });
  }
};

// Fungsi untuk mengambil semua pesanan milik satu pengguna
const getUserRentals = async (req, res) => {
  try {
    const userId = req.user.uid; // Ambil UID dari token yang sudah diverifikasi

    const rentalsRef = db.collection('rentals');
    const snapshot = await rentalsRef
      .where('user_id', '==', userId)
      .orderBy('created_at', 'desc') // Tampilkan yang terbaru di atas
      .get();

    if (snapshot.empty) {
      return res.status(200).json({
        message: 'Anda belum memiliki riwayat pesanan.',
        rentals: []
      });
    }

    const rentals = snapshot.docs.map(doc => {
      const data = doc.data();
      // Lakukan pengecekan sebelum mengubah format tanggal
      return {
        id: doc.id,
        ...data,
        // Konversi timestamp Firestore ke format string ISO agar mudah di-parse di frontend
        created_at: data.created_at && data.created_at.toDate ? data.created_at.toDate().toISOString() : null,
        updated_at: data.updated_at && data.updated_at.toDate ? data.updated_at.toDate().toISOString() : null,
        konfirmasi_kadaluarsa_at: data.konfirmasi_kadaluarsa_at && data.konfirmasi_kadaluarsa_at.toDate ? data.konfirmasi_kadaluarsa_at.toDate().toISOString() : null,
      }
    });

    res.status(200).json({
      message: 'Riwayat pesanan berhasil diambil.',
      rentals
    });

    } catch (error) {
    console.error('Error fetching user rentals:', error);
    res.status(500).json({ message: 'Gagal mengambil riwayat pesanan.', error: error.message });
  }
};

// [ADMIN] Mengambil semua pesanan (bisa difilter by status)
const getAllRentals = async (req, res) => {
  try {
    const { status } = req.query; // Ambil query parameter ?status=...
    let rentalsQuery = db.collection('rentals');

    if (status) {
      rentalsQuery = rentalsQuery.where('status', '==', status);
    }
    
    const snapshot = await rentalsQuery.orderBy('created_at', 'desc').get();

    const rentals = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id, ...data,
        created_at: data.created_at.toDate().toISOString(),
        updated_at: data.updated_at.toDate().toISOString(),
        konfirmasi_kadaluarsa_at: data.konfirmasi_kadaluarsa_at ? data.konfirmasi_kadaluarsa_at.toDate().toISOString() : null,
      }
    });
    res.status(200).json({ rentals });
  } catch (error) {
    console.error('Error fetching all rentals:', error);
    res.status(500).json({ message: 'Gagal mengambil semua pesanan.', error: error.message });
  }
};

// ADMIN Mengubah status pesanan (Konfirmasi / Tolak)
const updateRentalStatus = async (req, res) => {
  try {
    const { rentalId } = req.params;
    const { status, catatan_admin } = req.body; // status baru: 'Dikonfirmasi' atau 'Ditolak'

    if (!status || !['Dikonfirmasi', 'Ditolak'].includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid. Harus "Dikonfirmasi" atau "Ditolak".' });
    }

    const rentalRef = db.collection('rentals').doc(rentalId);
    const rentalDoc = await rentalRef.get();

    if (!rentalDoc.exists) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan.' });
    }

    // Jika pesanan ditolak, kembalikan status PS5 menjadi 'Tersedia'
    if (status === 'Ditolak') {
      const unitId = rentalDoc.data().unit_id;
      const ps5UnitRef = db.collection('ps5_units').doc(unitId);
      await ps5UnitRef.update({ status: 'Tersedia' });
    }

    await rentalRef.update({
      status: status,
      catatan_admin: catatan_admin || '',
      updated_at: new Date()
    });

    res.status(200).json({ message: `Pesanan berhasil diubah menjadi "${status}".` });

  } catch (error) {
    console.error('Error updating rental status:', error);
    res.status(500).json({ message: 'Gagal mengubah status pesanan.', error: error.message });
  }
};

module.exports = {
  checkAvailability,
  createRental,
  getUserRentals,
  getAllRentals,
  updateRentalStatus
};