    // frontend/src/pages/user/Login.jsx

    import React, { useState } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import styles from '../../styles/pages/Login.module.css';
    import { useAuth } from '../../context/AuthContext';

    const Login = ({ adminOnly = false }) => { 
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');
      const [loading, setLoading] = useState(false);
      
      const { login, currentUser, loading: authLoading } = useAuth(); 
      const navigate = useNavigate();

      // Jika user sudah login dan mencoba akses /login, redirect
      React.useEffect(() => {
        if (!authLoading && currentUser) {
          if (adminOnly && currentUser.role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
          } else if (!adminOnly && currentUser.role !== 'admin') {
            navigate('/', { replace: true });
          } else if (!adminOnly && currentUser.role === 'admin') { 
            navigate('/admin/dashboard', { replace: true }); 
          }
        }
      }, [currentUser, authLoading, navigate, adminOnly]);


      const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true); // Loading untuk submit form

        try {
          await login(email, password);
          console.log('Login berhasil!');
          // Navigasi akan ditangani oleh useEffect di atas setelah currentUser diperbarui
        } catch (err) {
          console.error('Login Error:', err);
          if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
            setError('Email atau password salah.');
          } else if (err.code === 'auth/invalid-email') {
            setError('Format email tidak valid.');
          } else {
            setError('Login gagal. Silakan coba lagi. Pesan error: ' + err.message);
          }
        } finally {
          setLoading(false); // Hentikan loading submit form
        }
      };

      // Jangan tampilkan form jika sedang dalam proses autentikasi global atau sudah login
      if (authLoading || currentUser) {
        return null; // Atau tampilkan loading spinner di sini jika mau
      }

      return (
        <div className={styles.container}>
          <div className={styles.card}>
            <h2 className={styles.title}>{adminOnly ? "Admin Login" : "Login ke RentaPlay"}</h2>
            <form onSubmit={handleSubmit}>
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
                <label htmlFor="password" className={styles.label}>Password</label>
                <input
                  type="password"
                  id="password"
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
                  required
                />
              </div>
              {error && <p className={styles.errorText} style={{ color: 'var(--danger-color)', marginBottom: 'var(--spacing-sm)' }}>{error}</p>}
              <button type="submit" className={styles.button} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            {!adminOnly && ( 
              <p className={styles.linkText}>
                Belum punya akun? <Link to="/register" className={styles.link}>Daftar di sini</Link>
              </p>
            )}
          </div>
        </div>
      );
    };

    export default Login;
    