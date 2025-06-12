// frontend/src/pages/admin/AdminDashboard.jsx

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [targetUid, setTargetUid] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); 

  const handleSetAdminRole = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!targetUid) {
      setMessage('UID tidak boleh kosong.');
      setMessageType('error');
      return;
    }

    try {
      const token = await currentUser.getIdToken(); 

      const response = await fetch('http://localhost:5000/api/admin/set-admin-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ uid: targetUid })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setMessageType('success');
        setTargetUid(''); 
        alert(data.message + ". Pengguna perlu login ulang."); 
      } else {
        setMessage(data.message || 'Gagal menetapkan role admin.');
        setMessageType('error');
        alert(data.message || 'Gagal menetapkan role admin.'); 
      }
    } catch (error) {
      console.error('Error saat mencoba menetapkan role admin:', error);
      setMessage('Terjadi kesalahan koneksi atau server.');
      setMessageType('error');
      alert('Terjadi kesalahan koneksi atau server.');
    }
  };

  return (
    <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
      <h1 style={{ color: 'var(--primary-green)' }}>Admin Dashboard</h1>
      {currentUser ? (
        <>
          <p style={{ fontSize: 'var(--font-lg)', color: 'var(--gray-800)' }}>
            Halo, {currentUser.nama_lengkap || currentUser.email}! Anda login sebagai <strong>{currentUser.role}</strong>.
          </p>
          <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--spacing-xl)' }}>
            Ini adalah halaman pusat kendali untuk bisnis RentaPlay Anda.
          </p>

          {/* Bagian Navigasi Admin - Menggunakan SVG untuk ikon */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: 'var(--spacing-md)', 
            marginBottom: 'var(--spacing-xl)', 
            maxWidth: '600px', 
            margin: '0 auto var(--spacing-xl) auto' 
          }}>
            {/* Kartu Navigasi Manajemen PS5 */}
            <Link 
              to="/admin/ps5-management" 
              style={{
                backgroundColor: 'var(--clean-white)', 
                color: 'var(--primary-green)', 
                border: '2px solid var(--primary-green)', 
                padding: 'var(--spacing-md)', 
                borderRadius: 'var(--radius-lg)', 
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out, transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column', 
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = 'var(--primary-green)';
                e.currentTarget.style.color = 'var(--clean-white)'; // Warna teks ikut berubah
                e.currentTarget.style.transform = 'translateY(-3px)'; 
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                // Ubah warna fill SVG di dalamnya
                e.currentTarget.querySelector('svg').style.fill = 'var(--clean-white)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = 'var(--clean-white)';
                e.currentTarget.style.color = 'var(--primary-green)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                // Kembalikan warna fill SVG
                e.currentTarget.querySelector('svg').style.fill = 'var(--primary-green)';
              }}
            >
              {/* SVG Icon untuk PS5 */}
              <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--primary-green)" style={{ marginBottom: 'var(--spacing-xs)', transition: 'fill 0.3s ease-in-out' }}>
                <path d="M14.7 6.3a.9.9 0 0 0-1.2 0L8.5 11.2a1 1 0 0 0 0 1.5l5 5a.9.9 0 0 0 1.2 0c.3-.3.3-.8 0-1.1L9.6 12l5-5a.8.8 0 0 0 0-1.2zM21 12a9 9 0 1 0-9 9c4.9 0 9-4 9-9zM12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/>
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/>
                <path d="M12 7a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1z"/>
                <path d="M12 12a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0v-4a1 1 0 0 0-1-1z"/>
                <path d="M8 12a1 1 0 0 0 1 1h4a1 1 0 0 0 0-2H9a1 1 0 0 0-1 1z"/>
                <path d="M16 12a1 1 0 0 0 1-1V7a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z"/>
                <path d="M7 16a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2H7z"/>
                <path d="M17 16a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0v-4a1 1 0 0 0-1-1z"/>
                <circle cx="9" cy="8" r="1"/>
                <circle cx="15" cy="8" r="1"/>
                <circle cx="9" cy="16" r="1"/>
                <circle cx="15" cy="16" r="1"/>
              </svg>
              Manajemen PS5
            </Link>
            
            {/* Kartu Navigasi Manajemen Pesanan */}
            <Link 
              to="/admin/order-management" 
              style={{
                backgroundColor: 'var(--clean-white)', 
                color: 'var(--primary-green)', 
                border: '2px solid var(--primary-green)', 
                padding: 'var(--spacing-md)', 
                borderRadius: 'var(--radius-lg)', 
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out, transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = 'var(--primary-green)';
                e.currentTarget.style.color = 'var(--clean-white)';
                e.currentTarget.style.transform = 'translateY(-3px)'; 
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                // Ubah warna fill SVG di dalamnya
                e.currentTarget.querySelector('svg').style.fill = 'var(--clean-white)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = 'var(--clean-white)';
                e.currentTarget.style.color = 'var(--primary-green)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                // Kembalikan warna fill SVG
                e.currentTarget.querySelector('svg').style.fill = 'var(--primary-green)';
              }}
            >
              {/* SVG Icon untuk Kotak / Paket */}
              <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--primary-green)" style={{ marginBottom: 'var(--spacing-xs)', transition: 'fill 0.3s ease-in-out' }}>
                <path d="M21 8H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1zM4 10h16v10H4V10z"/>
                <path d="M17 6h-2V5a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v1H7a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1zM9 5h6v1H9V5z"/>
              </svg>
              Manajemen Pesanan
            </Link>
          </div>

          {/* Form untuk Menetapkan Role Admin */}
          <div style={{ 
            backgroundColor: 'var(--clean-white)', 
            padding: 'var(--spacing-xl)', 
            borderRadius: 'var(--radius-lg)', 
            boxShadow: 'var(--shadow-md)',
            maxWidth: '500px',
            margin: '0 auto var(--spacing-2xl) auto' 
          }}>
            <h3 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--gray-900)' }}>Tetapkan Role Admin</h3>
            <form onSubmit={handleSetAdminRole}>
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <label htmlFor="targetUid" style={{ display: 'block', marginBottom: 'var(--spacing-sm)', textAlign: 'left', fontWeight: '500' }}>UID Pengguna Target:</label>
                <input
                  type="text"
                  id="targetUid"
                  value={targetUid}
                  onChange={(e) => setTargetUid(e.target.value)}
                  placeholder="Masukkan UID pengguna yang akan dijadikan admin"
                  style={{ 
                    width: '100%', 
                    padding: 'var(--spacing-sm)', 
                    border: '1px solid var(--gray-300)', 
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--font-base)'
                  }}
                  required
                />
              </div>
              {message && (
                <p style={{ 
                  color: messageType === 'success' ? 'var(--success-color)' : 'var(--danger-color)', 
                  marginBottom: 'var(--spacing-md)' 
                }}>{message}</p>
              )}
              <button 
                type="submit" 
                style={{
                  backgroundColor: 'var(--primary-blue)', 
                  color: 'var(--clean-white)', 
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-lg)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'background-color 0.3s ease-in-out',
                  width: '100%'
                }}
              >
                Set Admin Role
              </button>
            </form>
          </div>
        </>
      ) : (
        <p>Memuat info admin...</p>
      )}
    </div>
  );
};

export default AdminDashboard;