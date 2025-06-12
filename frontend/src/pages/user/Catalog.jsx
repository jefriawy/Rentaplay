// frontend/src/pages/user/Catalog.jsx

import React, { useState, useEffect } from 'react';
import PS5Card from '../../components/ps5/PS5Card';
import { useAuth } from '../../context/AuthContext';

const Catalog = () => {
  const { currentUser, loading: authLoading } = useAuth(); 
  const [ps5Units, setPs5Units] = useState([]);
  const [fetchError, setFetchError] = useState('');
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);

  // Hapus data dummy PS5 Units dari sini, karena kita akan ambil dari API

  useEffect(() => {
    const fetchPs5Units = async () => {
      setIsLoadingCatalog(true);
      setFetchError('');
      try {
        // Panggil API backend untuk mendapatkan unit PS5 yang tersedia
        const response = await fetch('http://localhost:5000/api/ps5/available');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal mengambil unit PS5 dari server.');
        }

        const data = await response.json();
        setPs5Units(data.ps5Units); // Set data PS5 dari respons API
        console.log('Fetched PS5 Units:', data.ps5Units); // Log untuk debugging

      } catch (error) {
        console.error('Error fetching PS5 units:', error);
        setFetchError(error.message || 'Gagal memuat daftar PS5. Silakan coba lagi.');
      } finally {
        setIsLoadingCatalog(false);
      }
    };

    // Pastikan AuthContext sudah selesai loading sebelum memuat katalog
    if (!authLoading) {
      fetchPs5Units();
    }
  }, [authLoading]); // Dependensi sekarang hanya pada authLoading

  // Global loading state untuk katalog dan otentikasi
  if (authLoading || isLoadingCatalog) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)', fontSize: '1.5rem', color: 'var(--primary-green)', backgroundColor: 'var(--pale-white)' }}>
        Memuat katalog PS5...
      </div>
    );
  }

  if (fetchError) {
    return (
      <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--danger-color)' }}>
        <h2 style={{ color: 'var(--danger-color)' }}>Error: {fetchError}</h2>
        <p>Silakan refresh halaman atau coba lagi nanti.</p>
      </div>
    );
  }

  if (ps5Units.length === 0) {
    return (
      <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--gray-700)' }}>
        <h2 style={{ color: 'var(--gray-900)' }}>Belum ada unit PS5 yang tersedia saat ini.</h2>
        <p>Silakan cek kembali nanti atau hubungi admin.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--spacing-xl)', backgroundColor: 'var(--pale-white)', minHeight: 'calc(100vh - 70px)' }}> 
      <h1 style={{ textAlign: 'center', color: 'var(--primary-green)', marginBottom: 'var(--spacing-2xl)' }}>
        Katalog PlayStation 5
      </h1>

      {/* Pesan selamat datang jika user login */}
      {currentUser && (
        <p style={{ textAlign: 'center', color: 'var(--gray-700)', marginBottom: 'var(--spacing-xl)' }}>
          Selamat datang, {currentUser.nama_lengkap || currentUser.email}!
        </p>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: 'var(--spacing-xl)' 
      }}>
        {ps5Units.map((unit) => (
          <PS5Card key={unit.id} ps5Unit={unit} />
        ))}
      </div>
    </div>
  );
};

export default Catalog;