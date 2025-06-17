// frontend/src/pages/user/Booking.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // <-- TAMBAHKAN Link DI SINI
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/pages/Booking.module.css';

const Booking = () => {
  const { ps5Id } = useParams(); 
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();

  const [ps5Unit, setPs5Unit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [tanggalMulai, setTanggalMulai] = useState('');
  const [jamMulai, setJamMulai] = useState('');
  const [durasi, setDurasi] = useState(''); 
  const [alamatPengiriman, setAlamatPengiriman] = useState({
    jalan: '',
    kelurahan: '',
    kecamatan: '',
    kota: '',
    kode_pos: '',
    patokan: ''
  });
  const [nomorKontak, setNomorKontak] = useState('');
  const [totalBiaya, setTotalBiaya] = useState(0);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingMessageType, setBookingMessageType] = useState(''); 


  const API_BASE_URL = 'http://localhost:5000/api'; 

  useEffect(() => {
    const fetchPs5Details = async () => {
      setLoading(true);
      setError('');
      try {
        if (!currentUser || !currentUser.getIdToken) {
          throw new Error("Autentikasi diperlukan untuk melihat detail PS5.");
        }
        const token = await currentUser.getIdToken();
        const response = await fetch(`${API_BASE_URL}/ps5/${ps5Id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal mengambil detail PS5.');
        }

        const data = await response.json();
        setPs5Unit(data.ps5Unit);
        if (currentUser.nomor_hp && !nomorKontak) {
            setNomorKontak(currentUser.nomor_hp);
        }
      } catch (err) {
        console.error('Error fetching PS5 details:', err);
        setError('Gagal memuat detail PS5: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && currentUser) { 
      fetchPs5Details();
    } else if (!authLoading && !currentUser) {
      navigate('/login', { replace: true });
    }
  }, [ps5Id, authLoading, currentUser, navigate]); 

  useEffect(() => {
    if (ps5Unit && durasi > 0 && ps5Unit.harga_sewa) {
      setTotalBiaya(durasi * ps5Unit.harga_sewa);
    } else {
      setTotalBiaya(0);
    }
  }, [durasi, ps5Unit]);

  const handleAlamatChange = (e) => {
    const { name, value } = e.target;
    setAlamatPengiriman(prevAlamat => ({
      ...prevAlamat,
      [name]: value
    }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingMessage('');
    setBookingMessageType('');
    setIsBookingLoading(true);

    if (!ps5Unit || ps5Unit.status !== 'Tersedia') {
      setBookingMessage('Unit PS5 ini tidak tersedia untuk disewa.');
      setBookingMessageType('error');
      setIsBookingLoading(false);
      return;
    }
    if (!tanggalMulai || !jamMulai || !durasi || durasi <= 0 || totalBiaya <= 0) {
        setBookingMessage('Mohon lengkapi detail sewa (tanggal, jam, durasi).');
        setBookingMessageType('error');
        setIsBookingLoading(false);
        return;
    }
    if (!alamatPengiriman.jalan || !alamatPengiriman.kota || !nomorKontak) {
        setBookingMessage('Mohon lengkapi alamat pengiriman dan nomor kontak.');
        setBookingMessageType('error');
        setIsBookingLoading(false);
        return;
    }

    try {
      const token = await currentUser.getIdToken();
      
      const checkAvailabilityResponse = await fetch(`${API_BASE_URL}/rentals/check-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          unit_id: ps5Unit.id,
          tanggal_mulai: tanggalMulai,
          jam_mulai: jamMulai,
          durasi: Number(durasi)
        })
      });

      if (!checkAvailabilityResponse.ok) {
        const errorData = await checkAvailabilityResponse.json();
        throw new Error(errorData.message || 'PS5 tidak tersedia untuk tanggal/waktu yang dipilih.');
      }
      
      const rentalData = {
        user_id: currentUser.uid,
        unit_id: ps5Unit.id,
        tanggal_mulai: tanggalMulai,
        jam_mulai: jamMulai,
        durasi: Number(durasi),
        alamat_pengiriman: alamatPengiriman,
        nomor_kontak: nomorKontak,
        total_biaya: totalBiaya,
        // Status tidak perlu dikirim dari frontend lagi, karena sudah diatur di backend
        transaction_id: '' 
      };

      const createRentalResponse = await fetch(`${API_BASE_URL}/rentals/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(rentalData)
      });

      if (!createRentalResponse.ok) {
        const errorData = await createRentalResponse.json();
        throw new Error(errorData.message || 'Gagal membuat pesanan sewa.');
      }

      const rentalResult = await createRentalResponse.json();
      console.log('Rental created, waiting for confirmation:', rentalResult);
      setBookingMessage('Pesanan berhasil dibuat! Anda akan diarahkan ke dashboard untuk menunggu konfirmasi admin.');
      setBookingMessageType('success');
      alert('Pesanan berhasil dibuat! Silakan cek dashboard Anda untuk status konfirmasi dari admin.');

      navigate('/dashboard', { replace: true });

    } catch (err) {
      console.error('Booking Error:', err);
      setBookingMessage(err.message || 'Terjadi kesalahan saat memproses pesanan.');
      setBookingMessageType('error');
    } finally {
      setIsBookingLoading(false);
    }
  };

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading || authLoading) {
    return (
      <div className={styles.loadingContainer}>
        Memuat detail PS5...
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error: {error}</h2>
        <p>Silakan kembali ke <Link to="/">katalog</Link> atau coba lagi nanti.</p>
      </div>
    );
  }

  if (!ps5Unit) {
    return (
        <div className={styles.errorContainer}>
            <h2>PS5 tidak ditemukan.</h2>
            <p>Unit PS5 yang Anda cari mungkin tidak ada atau telah dihapus. Kembali ke <Link to="/">katalog</Link>.</p>
        </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sewa PlayStation 5</h1>
      <div className={styles.ps5DetailCard}>
        <div className={styles.imageContainer}>
          {ps5Unit.foto_url ? (
            <img 
              src={ps5Unit.foto_url} 
              alt={`PlayStation 5 ${ps5Unit.jenis}`} 
              className={styles.image} 
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = "https://placehold.co/200x150/e0e0e0/555555?text=No+Image"; 
              }}
            />
          ) : (
            <p className={styles.placeholderText}>Gambar PS5 Tidak Tersedia</p>
          )}
        </div>
        <div className={styles.info}>
          <h2>PS5 {ps5Unit.jenis}</h2>
          <p><strong>Harga Sewa:</strong> {formatRupiah(ps5Unit.harga_sewa)} / jam</p>
          <p><strong>Spesifikasi:</strong> {ps5Unit.spesifikasi}</p>
          <p><strong>Kondisi:</strong> {ps5Unit.kondisi}</p>
          <p><strong>Status:</strong> <span className={ps5Unit.status === 'Tersedia' ? styles.statusAvailable : styles.statusUnavailable}>{ps5Unit.status}</span></p>
          {ps5Unit.daftar_game && ps5Unit.daftar_game.length > 0 && (
            <p><strong>Game Tersedia:</strong> {ps5Unit.daftar_game.join(', ')}</p>
          )}
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Formulir Pemesanan</h2>
      <form onSubmit={handleBookingSubmit} className={styles.bookingForm}>
        {bookingMessage && (
          <p className={bookingMessageType === 'success' ? styles.successMessage : styles.errorMessage}>
            {bookingMessage}
          </p>
        )}
        <div className={styles.formGroup}>
          <label htmlFor="tanggalMulai" className={styles.label}>Tanggal Mulai Sewa:</label>
          <input
            type="date"
            id="tanggalMulai"
            value={tanggalMulai}
            onChange={(e) => setTanggalMulai(e.target.value)}
            className={styles.input}
            required
            min={new Date().toISOString().split('T')[0]} 
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="jamMulai" className={styles.label}>Jam Mulai Sewa:</label>
          <input
            type="time"
            id="jamMulai"
            value={jamMulai}
            onChange={(e) => setJamMulai(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="durasi" className={styles.label}>Durasi Sewa (Jam):</label>
          <input
            type="number"
            id="durasi"
            value={durasi}
            onChange={(e) => setDurasi(e.target.value)}
            className={styles.input}
            min="1"
            placeholder="Min. 1 jam"
            required
          />
        </div>

        <div className={styles.totalBiaya}>
          <strong>Total Biaya:</strong> {formatRupiah(totalBiaya)}
        </div>

        <h3 className={styles.subSectionTitle}>Alamat Pengiriman & Kontak</h3>
        <div className={styles.formGroup}>
          <label htmlFor="jalan" className={styles.label}>Jalan & Nomor Rumah:</label>
          <input
            type="text"
            id="jalan"
            name="jalan"
            value={alamatPengiriman.jalan}
            onChange={handleAlamatChange}
            className={styles.input}
            placeholder="Cth: Jl. Kebon Jeruk No. 10"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="kelurahan" className={styles.label}>Kelurahan:</label>
          <input
            type="text"
            id="kelurahan"
            name="kelurahan"
            value={alamatPengiriman.kelurahan}
            onChange={handleAlamatChange}
            className={styles.input}
            placeholder="Cth: Duri Kepa"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="kecamatan" className={styles.label}>Kecamatan:</label>
          <input
            type="text"
            id="kecamatan"
            name="kecamatan"
            value={alamatPengiriman.kecamatan}
            onChange={handleAlamatChange}
            className={styles.input}
            placeholder="Cth: Kebon Jeruk"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="kota" className={styles.label}>Kota:</label>
          <input
            type="text"
            id="kota"
            name="kota"
            value={alamatPengiriman.kota}
            onChange={handleAlamatChange}
            className={styles.input}
            placeholder="Cth: Jakarta Barat"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="kode_pos" className={styles.label}>Kode Pos:</label>
          <input
            type="text"
            id="kode_pos"
            name="kode_pos"
            value={alamatPengiriman.kode_pos}
            onChange={handleAlamatChange}
            className={styles.input}
            placeholder="Cth: 11510"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="patokan" className={styles.label}>Patokan / Catatan Pengiriman:</label>
          <textarea
            id="patokan"
            name="patokan"
            value={alamatPengiriman.patokan}
            onChange={handleAlamatChange}
            className={styles.input}
            placeholder="Cth: Dekat minimarket, rumah warna biru"
            rows="2"
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="nomorKontak" className={styles.label}>Nomor Kontak (HP):</label>
          <input
            type="tel"
            id="nomorKontak"
            value={nomorKontak}
            onChange={(e) => setNomorKontak(e.target.value)}
            className={styles.input}
            placeholder="Cth: 081234567890"
            required
          />
        </div>

        <button type="submit" className={styles.button} disabled={isBookingLoading || ps5Unit.status !== 'Tersedia'}>
          {isBookingLoading ? 'Memproses Pesanan...' : ps5Unit.status !== 'Tersedia' ? `Tidak Tersedia (${ps5Unit.status})` : 'Pesan Sekarang'}
        </button>
      </form>
    </div>
  );
};

export default Booking;