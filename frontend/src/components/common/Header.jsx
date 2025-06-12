// frontend/src/components/common/Header.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      console.log('User logged out successfully.');
      navigate('/login', { replace: true }); // Arahkan ke halaman login setelah logout
    } catch (error) {
      console.error('Failed to log out:', error);
      alert('Gagal logout. Silakan coba lagi.'); // Gunakan modal kustom nanti
    }
  };

  return (
    <header style={{ 
      backgroundColor: 'var(--clean-white)', 
      padding: 'var(--spacing-md) var(--spacing-xl)', 
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky', 
      top: 0,
      zIndex: 100, 
      width: '100%',
      boxSizing: 'border-box' 
    }}>
      {/* Logo/Nama Aplikasi di kiri */}
      <Link to={currentUser ? '/' : '/catalog'} style={{ textDecoration: 'none' }}>
        <h2 style={{ color: 'var(--primary-green)', margin: 0, fontSize: 'var(--font-xl)' }}>
          RentaPlay
        </h2>
      </Link>

      {/* Navigasi / Aksi di kanan */}
      <nav style={{ display: 'flex', alignItems: 'center' }}>
        {currentUser ? (
          <>
            {/* Tautan ke Dashboard berdasarkan role */}
            <Link 
              // PERBAIKAN DI SINI: Mengarahkan ke /admin/dashboard jika admin
              to={currentUser.role === 'admin' ? "/admin/dashboard" : "/dashboard"} 
              style={{ 
                color: 'var(--primary-blue)', 
                textDecoration: 'none', 
                fontSize: 'var(--font-base)', 
                marginRight: 'var(--spacing-md)',
                transition: 'color 0.3s ease-in-out'
              }}
              onMouseOver={e => e.target.style.color = 'var(--primary-dark)'}
              onMouseOut={e => e.target.style.color = 'var(--primary-blue)'}
            >
              Dashboard
            </Link>
            
            {/* Tombol Logout */}
            <button 
              onClick={handleLogout} 
              style={{ 
                backgroundColor: 'var(--danger-color)', 
                color: 'var(--clean-white)', 
                padding: 'var(--spacing-sm) var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-base)',
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
          /* Tautan Login/Register jika belum login */
          <>
            <Link 
              to="/login" 
              style={{ 
                color: 'var(--gray-700)', 
                textDecoration: 'none', 
                fontSize: 'var(--font-base)', 
                marginRight: 'var(--spacing-md)',
                transition: 'color 0.3s ease-in-out'
              }}
              onMouseOver={e => e.target.style.color = 'var(--primary-green)'}
              onMouseOut={e => e.target.style.color = 'var(--gray-700)'}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              style={{ 
                backgroundColor: 'var(--primary-green)', 
                color: 'var(--clean-white)', 
                padding: 'var(--spacing-sm) var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-base)',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'background-color 0.3s ease-in-out'
              }}
              onMouseOver={e => e.target.style.backgroundColor = 'var(--primary-dark-green)'}
              onMouseOut={e => e.target.style.backgroundColor = 'var(--primary-green)'}
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;