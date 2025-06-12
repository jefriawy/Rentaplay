// frontend/src/pages/admin/PS5Management.jsx

import React, { useState, useEffect, useCallback } from 'react'; // <-- Tambahkan useCallback
import { useAuth } from '../../context/AuthContext'; 
import PS5Form from '../../components/ps5/PS5Form'; 
import styles from '../../styles/pages/AdminDashboard.module.css'; 

const PS5Management = () => {
  const { currentUser } = useAuth(); 
  const [ps5Units, setPs5Units] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false); 
  const [editingPs5, setEditingPs5] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const API_BASE_URL = 'http://localhost:5000/api/ps5'; 

  // Menggunakan useCallback untuk mengoptimalkan fungsi fetchPs5Units
  // Ini mencegah fungsi dibuat ulang pada setiap render jika dependensinya tidak berubah
  const fetchPs5Units = useCallback(async () => { // <-- Bungkus dengan useCallback
    setLoading(true);
    setError('');
    try {
      if (!currentUser || !currentUser.getIdToken) {
          throw new Error("Pengguna belum sepenuhnya terautentikasi atau getIdToken tidak tersedia.");
      }
      const token = await currentUser.getIdToken(); 
      
      const response = await fetch(API_BASE_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengambil data PS5 dari server.');
      }
      const data = await response.json();
      setPs5Units(data.ps5Units); 
    } catch (err) {
      console.error('Error fetching PS5 units:', err);
      setError('Gagal memuat unit PS5: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser]); // <-- currentUser adalah dependency dari useCallback

  useEffect(() => {
    // Pastikan currentUser tersedia sebelum mencoba mengambil data
    // dan pastikan currentUser.getIdToken juga tersedia (karena digunakan di fetchPs5Units)
    if (currentUser && currentUser.getIdToken) {
      fetchPs5Units();
    }
  }, [currentUser, fetchPs5Units]); // <-- Tambahkan fetchPs5Units ke dependency array useEffect

  const handleAddPs5 = async (formData) => {
    setFormLoading(true);
    setError(''); 
    try {
      const token = await currentUser.getIdToken(); 
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menambah PS5.');
      }
      alert('Unit PS5 berhasil ditambahkan!');
      fetchPs5Units(); 
      setIsModalOpen(false); 
    } catch (err) {
      console.error('Error adding PS5:', err);
      setError('Gagal menambah PS5: ' + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdatePs5 = async (formData) => {
    setFormLoading(true);
    setError('');
    try {
      const token = await currentUser.getIdToken(); 
      const response = await fetch(`${API_BASE_URL}/${editingPs5.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengupdate PS5.');
      }
      alert('Unit PS5 berhasil diupdate!');
      fetchPs5Units(); 
      setIsModalOpen(false); 
      setEditingPs5(null); 
    } catch (err) {
      console.error('Error updating PS5:', err);
      setError('Gagal mengupdate PS5: ' + err.message);
    } finally {
      setFormLoading(false); 
    }
  };

  const handleDeletePs5 = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus unit PS5 ini?')) { 
      return;
    }
    setLoading(true); 
    setError('');
    try {
      const token = await currentUser.getIdToken(); 
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus PS5.');
      }
      alert('Unit PS5 berhasil dihapus!');
      fetchPs5Units(); 
    } catch (err) {
      console.error('Error deleting PS5:', err);
      setError('Gagal menghapus PS5: ' + err.message);
    } finally {
      setLoading(false); 
    }
  };

  const openAddModal = () => {
    setEditingPs5(null); 
    setIsModalOpen(true);
  };

  const openEditModal = (ps5Unit) => {
    setEditingPs5(ps5Unit); 
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPs5(null); 
    setError(''); 
  };

  if (!currentUser) {
    return (
        <div className={styles.container} style={{ textAlign: 'center', fontSize: '1.5rem', color: 'var(--danger-color)' }}>
            Akses Ditolak: Anda harus login sebagai admin.
        </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container} style={{ textAlign: 'center', fontSize: '1.5rem', color: 'var(--primary-green)' }}>
        Memuat data manajemen PS5...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manajemen Unit PS5</h1>

      {error && <p className={styles.errorMessage}>{error}</p>}

      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <button 
          onClick={openAddModal} 
          className={styles.button}
          style={{ maxWidth: '300px', color: 'var(--clean-white)' }} 
        >
          + Tambah Unit PS5 Baru
        </button>
      </div>

      <div className={`${styles.section} ${styles.tableContainer}`}>
        <h2 className={styles.sectionTitle}>Daftar Semua Unit PS5</h2>
        {ps5Units.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--gray-700)' }}>Belum ada unit PS5 yang terdaftar.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Jenis</th>
                <th>No. Seri</th>
                <th>Harga/Jam</th>
                <th>Kondisi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {ps5Units.map((unit) => (
                <tr key={unit.id}>
                  <td>{unit.jenis}</td>
                  <td>{unit.nomor_seri}</td>
                  <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(unit.harga_sewa)}</td>
                  <td>{unit.kondisi}</td>
                  <td>{unit.status}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button 
                        onClick={() => openEditModal(unit)} 
                        className={`${styles.actionButton} ${styles.edit}`}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeletePs5(unit.id)} 
                        className={`${styles.actionButton} ${styles.delete}`}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button onClick={closeModal} className={styles.closeButton}>&times;</button>
            <h2 className={styles.sectionTitle}>{editingPs5 ? 'Edit Unit PS5' : 'Tambah Unit PS5 Baru'}</h2>
            <PS5Form 
              onSubmit={editingPs5 ? handleUpdatePs5 : handleAddPs5} 
              initialData={editingPs5} 
              isEdit={!!editingPs5} 
              loading={formLoading} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PS5Management;