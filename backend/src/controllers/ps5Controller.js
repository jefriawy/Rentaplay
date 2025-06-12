// backend/src/controllers/ps5Controller.js

const { db } = require('../config/firebase'); // Impor instance Firestore dari konfigurasi Firebase

// 1. Menambahkan Unit PS5 Baru (Admin)
const addPs5Unit = async (req, res) => {
  try {
    const { 
      jenis, 
      nomor_seri, 
      spesifikasi, 
      daftar_game, 
      kondisi, 
      harga_sewa, 
      foto_url, 
      status 
    } = req.body;

    // Validasi dasar input
    if (!jenis || !nomor_seri || !harga_sewa || !status) {
      return res.status(400).json({ message: 'Jenis, Nomor Seri, Harga Sewa, dan Status wajib diisi.' });
    }

    // Pastikan daftar_game adalah array
    const gamesArray = Array.isArray(daftar_game) ? daftar_game : [];

    const newPs5Unit = {
      jenis,
      nomor_seri,
      spesifikasi: spesifikasi || '', // Default jika tidak ada
      daftar_game: gamesArray,
      kondisi: kondisi || 'Baik', // Default kondisi
      harga_sewa: Number(harga_sewa), // Pastikan ini angka
      foto_url: foto_url || '', // Default jika tidak ada
      status: status, // Status awal, e.g., 'Tersedia'
      created_at: new Date(),
      updated_at: new Date()
    };

    const docRef = await db.collection('ps5_units').add(newPs5Unit); // Tambahkan dokumen ke koleksi
    res.status(201).json({ 
      message: 'Unit PS5 berhasil ditambahkan!', 
      ps5Unit: { id: docRef.id, ...newPs5Unit } 
    });

  } catch (error) {
    console.error('Error adding PS5 unit:', error);
    res.status(500).json({ message: 'Gagal menambahkan unit PS5.', error: error.message });
  }
};

// 2. Mengambil Semua Unit PS5 (untuk Admin)
const getAllPs5Units = async (req, res) => {
  try {
    const ps5UnitsRef = db.collection('ps5_units');
    const snapshot = await ps5UnitsRef.get(); // Ambil semua dokumen
    
    const ps5Units = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({ 
      message: 'Daftar unit PS5 berhasil diambil.', 
      ps5Units 
    });

  } catch (error) {
    console.error('Error fetching all PS5 units:', error);
    res.status(500).json({ message: 'Gagal mengambil daftar unit PS5.', error: error.message });
  }
};

// 3. Mengambil Unit PS5 Berdasarkan ID (Admin/Detail)
const getPs5UnitById = async (req, res) => {
    try {
      const { id } = req.params; // Ambil ID dari parameter URL
      const ps5UnitRef = db.collection('ps5_units').doc(id);
      const doc = await ps5UnitRef.get();
  
      if (!doc.exists) {
        return res.status(404).json({ message: 'Unit PS5 tidak ditemukan.' });
      }
  
      res.status(200).json({ 
        message: 'Unit PS5 berhasil diambil.', 
        ps5Unit: { id: doc.id, ...doc.data() } 
      });
  
    } catch (error) {
      console.error('Error fetching PS5 unit by ID:', error);
      res.status(500).json({ message: 'Gagal mengambil unit PS5.', error: error.message });
    }
  };

// 4. Mengupdate Unit PS5 (Admin)
const updatePs5Unit = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      jenis, 
      nomor_seri, 
      spesifikasi, 
      daftar_game, 
      kondisi, 
      harga_sewa, 
      foto_url, 
      status 
    } = req.body;

    const ps5UnitRef = db.collection('ps5_units').doc(id);
    const doc = await ps5UnitRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Unit PS5 tidak ditemukan.' });
    }

    const updatedData = {
      jenis: jenis || doc.data().jenis,
      nomor_seri: nomor_seri || doc.data().nomor_seri,
      spesifikasi: spesifikasi || doc.data().spesifikasi,
      daftar_game: Array.isArray(daftar_game) ? daftar_game : doc.data().daftar_game,
      kondisi: kondisi || doc.data().kondisi,
      harga_sewa: harga_sewa ? Number(harga_sewa) : doc.data().harga_sewa,
      foto_url: foto_url || doc.data().foto_url,
      status: status || doc.data().status,
      updated_at: new Date()
    };

    await ps5UnitRef.update(updatedData); // Update dokumen
    res.status(200).json({ message: 'Unit PS5 berhasil diupdate.', ps5Unit: { id: doc.id, ...updatedData } });

  } catch (error) {
    console.error('Error updating PS5 unit:', error);
    res.status(500).json({ message: 'Gagal mengupdate unit PS5.', error: error.message });
  }
};

// 5. Menghapus Unit PS5 (Admin)
const deletePs5Unit = async (req, res) => {
  try {
    const { id } = req.params;
    const ps5UnitRef = db.collection('ps5_units').doc(id);
    const doc = await ps5UnitRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Unit PS5 tidak ditemukan.' });
    }

    await ps5UnitRef.delete(); // Hapus dokumen
    res.status(200).json({ message: 'Unit PS5 berhasil dihapus.' });

  } catch (error) {
    console.error('Error deleting PS5 unit:', error);
    res.status(500).json({ message: 'Gagal menghapus unit PS5.', error: error.message });
  }
};

// 6. Mengambil Unit PS5 yang Tersedia (untuk User/Catalog)
const getAvailablePs5Units = async (req, res) => {
  try {
    const ps5UnitsRef = db.collection('ps5_units');
    // Query hanya unit yang statusnya 'Tersedia'
    const snapshot = await ps5UnitsRef.where('status', '==', 'Tersedia').get();
    
    const ps5Units = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({ 
      message: 'Daftar unit PS5 tersedia berhasil diambil.', 
      ps5Units 
    });

  } catch (error) {
    console.error('Error fetching available PS5 units:', error);
    res.status(500).json({ message: 'Gagal mengambil daftar unit PS5 tersedia.', error: error.message });
  }
};


module.exports = {
  addPs5Unit,
  getAllPs5Units,
  getPs5UnitById,
  updatePs5Unit,
  deletePs5Unit,
  getAvailablePs5Units
};