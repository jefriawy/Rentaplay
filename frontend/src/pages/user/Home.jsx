// frontend/src/pages/user/Home.jsx

import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Impor useAuth
import { useNavigate } from 'react-router-dom'; // Untuk logout

const Home = () => {
  const { currentUser, logout } = useAuth(); // Dapatkan currentUser dan logout dari AuthContext
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      console.log('User logged out');
      navigate('/login'); // Arahkan kembali ke halaman login setelah logout
    } catch (error) {
      console.error('Failed to log out:', error);
      alert('Gagal logout. Silakan coba lagi.');
    }
  };

  return (
    <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
      <h1 style={{ color: 'var(--primary-green)' }}>Selamat Datang di RentaPlay!</h1>
      {currentUser ? (
        <>
          <p style={{ fontSize: 'var(--font-lg)', color: 'var(--gray-800)', marginBottom: 'var(--spacing-md)' }}>
            Halo, {currentUser.nama_lengkap || currentUser.email}! Anda berhasil login sebagai "{currentUser.role}".
          </p>
          <p style={{ marginBottom: 'var(--spacing-xl)' }}>
            Ini adalah halaman utama Anda. Dari sini Anda bisa melihat katalog PS5 atau riwayat sewa Anda.
          </p>
          <button 
            onClick={handleLogout} 
            style={{ 
              backgroundColor: 'var(--danger-color)', 
              color: 'var(--clean-white)', 
              padding: 'var(--spacing-sm) var(--spacing-md)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-lg)',
              fontWeight: '600',
              cursor: 'pointer',
              border: 'none',
              transition: 'background-color 0.3s ease-in-out'
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <p>Anda belum login.</p> // Seharusnya tidak terlihat karena ini protected route
      )}
    </div>
  );
};

export default Home;