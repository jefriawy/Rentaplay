// frontend/src/pages/user/UserDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import OrderCard from '../../components/orders/OrderCard';

const UserDashboard = () => {
  const { currentUser } = useAuth(); 
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRentals = async () => {
      if (!currentUser) return;

      setLoading(true);
      setError('');
      try {
        const token = await currentUser.getIdToken();
        const response = await fetch('http://localhost:5000/api/rentals/my-rentals', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal mengambil data pesanan.');
        }

        const data = await response.json();
        setRentals(data.rentals);

        } catch (err) {
        setError(err.message);
        console.error("Fetch rentals error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [currentUser]);

  return (
    <div style={{ padding: 'var(--spacing-xl)', maxWidth: '960px', margin: '0 auto' }}> 
      <h1 style={{ color: 'var(--primary-green)', textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>User Dashboard</h1>
      {currentUser ? (
        <>
          <p style={{ fontSize: 'var(--font-lg)', color: 'var(--gray-700)', textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
            Selamat datang, {currentUser.nama_lengkap || currentUser.email}!
          </p>

          <h2 style={{ fontSize: 'var(--font-2xl)', color: 'var(--gray-800)', borderBottom: '2px solid var(--gray-200)', paddingBottom: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}>Riwayat Pesanan Anda</h2>

          {loading && <p style={{ textAlign: 'center' }}>Memuat pesanan...</p>}
          {error && <p style={{ textAlign: 'center', color: 'var(--danger-color)' }}>Error: {error}</p>}
          
          {!loading && rentals.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--gray-500)', padding: 'var(--spacing-xl)', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--radius-lg)' }}>
              <p>Anda belum memiliki pesanan. Silakan lihat katalog kami untuk mulai menyewa!</p>
            </div>
          )}

          {!loading && rentals.length > 0 && (
            <div>
              {rentals.map(rental => (
                <OrderCard key={rental.id} rental={rental} />
              ))}
            </div>
          )}
        </>
      ) : (
        <p>Memuat info user...</p>
      )}
    </div>
  );
};

export default UserDashboard;