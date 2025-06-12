// frontend/src/pages/user/Register.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../styles/pages/Register.module.css';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }
    if (password.length < 6) {
        setError('Password minimal harus 6 karakter.');
        return;
    }

    setLoading(true);

    try {
      await register(email, password, fullName, phoneNumber);
      console.log('Pendaftaran berhasil!');
      alert('Pendaftaran berhasil! Silakan login.'); // Berikan feedback ke user
      navigate('/login'); 
    } catch (err) {
      console.error('Register Error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email sudah terdaftar. Silakan gunakan email lain atau login.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Format email tidak valid.');
      } else {
        setError('Pendaftaran gagal. Silakan coba lagi. (' + err.message + ')');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Daftar Akun RentaPlay</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="fullName" className={styles.label}>Nama Lengkap</label>
            <input
              type="text"
              id="fullName"
              className={styles.input}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Masukkan nama lengkap Anda"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email Anda"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phoneNumber" className={styles.label}>Nomor HP</label>
            <input
              type="text" 
              id="phoneNumber"
              className={styles.input}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Masukkan nomor HP Anda"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Buat password (min. 6 karakter)"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>Konfirmasi Password</label>
            <input
              type="password"
              id="confirmPassword"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password"
              required
            />
          </div>
          {error && <p className={styles.errorText} style={{ color: 'var(--danger-color)', marginBottom: 'var(--spacing-sm)' }}>{error}</p>}
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Mendaftar...' : 'Daftar'}
          </button>
        </form>
        <p className={styles.linkText}>
          Sudah punya akun? <Link to="/login" className={styles.link}>Login di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
