import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/pages/AdminDashboard.module.css';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';
import CountdownCell from '../../components/admin/CountdownCell';

const OrderManagement = () => {
  const { currentUser } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('Menunggu Konfirmasi');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);

  const fetchRentals = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    setError('');
    try {
      const token = await currentUser.getIdToken();
      // Kirim filter status sebagai query parameter
      const response = await fetch(`http://localhost:5000/api/rentals?status=${filter}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Gagal memuat data pesanan.');
      const data = await response.json();
      setRentals(data.rentals);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser, filter]);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  // Fungsi untuk membuka modal
  const handleViewDetails = (rental) => {
    setSelectedRental(rental);
    setIsModalOpen(true);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRental(null);
  };

  const handleUpdateStatus = async (rentalId, newStatus) => {
    let reason = '';
    if (newStatus === 'Ditolak') {
      reason = prompt('Masukkan alasan penolakan (opsional):');
    }

    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`http://localhost:5000/api/rentals/${rentalId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus, catatan_admin: reason }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal mengubah status.');
      
      alert(`Pesanan berhasil diubah menjadi "${newStatus}"`);
      fetchRentals(); // Muat ulang data setelah berhasil
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <> {/* Gunakan Fragment agar modal bisa ditampilkan di luar div utama */}
      <div className={styles.container}>
        <h1 className={styles.title}>Manajemen Pesanan</h1>
        
        {loading && <p>Memuat pesanan...</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}

        <div className={`${styles.section} ${styles.tableContainer}`}>
          <h2 className={styles.sectionTitle}>Pesanan Masuk ({rentals.length})</h2>
          {rentals.length === 0 && !loading ? (
            <p>Tidak ada pesanan dengan status "{filter}".</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID Pesanan</th>
                  <th>User ID</th>
                  <th>Tgl Sewa</th>
                  <th>Status</th>
                  <th>Sisa Waktu</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map(rental => (
                  <tr key={rental.id}>
                    <td title={rental.id}>{rental.id.substring(0, 8)}...</td>
                    <td title={rental.user_id}>{rental.user_id.substring(0, 8)}...</td>
                    <td>{new Date(rental.tanggal_mulai).toLocaleDateString('id-ID')}</td>
                    <td>{rental.status}</td>
                    
                    <CountdownCell 
                      targetDate={rental.konfirmasi_kadaluarsa_at} 
                      status={rental.status} />

                    <td>
                      <div className={styles.actionButtons}>
                        {/* Tombol Baru untuk melihat detail */}
                        <button 
                          onClick={() => handleViewDetails(rental)}
                          className={styles.actionButton}>
                          Lihat Detail
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(rental.id, 'Dikonfirmasi')}
                          className={`${styles.actionButton} ${styles.edit}`}
                          style={{backgroundColor: 'var(--success-color)', color: 'white'}}
                        >
                          Konfirmasi
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(rental.id, 'Ditolak')}
                          className={`${styles.actionButton} ${styles.delete}`}
                        >
                          Tolak
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {/* Tampilkan Modal jika isModalOpen bernilai true */}
      {isModalOpen && <OrderDetailsModal rental={selectedRental} onClose={closeModal} />}
      </>
  );
};

export default OrderManagement;