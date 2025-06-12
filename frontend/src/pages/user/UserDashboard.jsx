// frontend/src/pages/user/UserDashboard.jsx

import React from 'react';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
  const { currentUser } = useAuth(); 

  return (
    <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center', minHeight: 'calc(100vh - 70px)' }}> 
      <h1 style={{ color: 'var(--primary-green)' }}>User Dashboard</h1>
      {currentUser ? (
        <>
          <p style={{ fontSize: 'var(--font-lg)', color: 'var(--gray-800)' }}>
            Selamat datang di Dashboard Anda, {currentUser.nama_lengkap || currentUser.email}!
          </p>
          <p style={{ color: 'var(--gray-600)' }}>
            Di sini Anda akan melihat riwayat sewa, pesanan aktif, dan notifikasi.
          </p>
          {/* TODO: Tambahkan komponen dan informasi dashboard yang sebenarnya di sini */}
          <div style={{ marginTop: 'var(--spacing-xl)', border: '1px dashed var(--gray-400)', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-md)' }}>
            <p>Konten Dashboard akan muncul di sini.</p>
            <p>Status peran Anda: <strong>{currentUser.role}</strong></p>
          </div>
        </>
      ) : (
        <p>Memuat info user...</p>
      )}
    </div>
  );
};

export default UserDashboard;