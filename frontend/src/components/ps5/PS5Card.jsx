// frontend/src/components/ps5/PS5Card.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/components/PS5Card.module.css';

const GameIcon = () => (
  <svg className={styles.gameIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
  </svg>
);

const PS5Card = ({ ps5Unit }) => {
  const { 
    id, 
    jenis, 
    harga_sewa, 
    daftar_game, 
    status, 
    foto_url,
    spesifikasi, // Sekarang spesifikasi akan digunakan
    kondisi
  } = ps5Unit;

  let statusClass;
  switch (status) {
    case 'Tersedia':
      statusClass = styles.statusAvailable;
      break;
    case 'Reserved':
      statusClass = styles.statusReserved;
      break;
    case 'Sedang Disewa':
      statusClass = styles.statusRented;
      break;
    case 'Dalam Perbaikan':
      statusClass = styles.statusMaintenance;
      break;
    default:
      statusClass = '';
  }

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {foto_url ? (
          <img 
            src={foto_url} 
            alt={`PlayStation 5 ${jenis}`} 
            className={styles.image} 
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = "https://placehold.co/200x150/e0e0e0/555555?text=No+Image"; 
            }}
          />
        ) : (
          <p className={styles.placeholderText}>Gambar PS5 Tidak Tersedia</p>
        )}
      </div>
      <div className={styles.details}>
        <h3 className={styles.title}>PS5 {jenis}</h3>
        <p className={styles.price}>{formatRupiah(harga_sewa)} / jam</p>
        {spesifikasi && ( // Tampilkan spesifikasi jika ada
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--gray-600)', marginBottom: 'var(--spacing-sm)' }}>
            {spesifikasi}
          </p>
        )}
        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--gray-600)', marginBottom: 'var(--spacing-sm)' }}>
          Kondisi: {kondisi || 'Baik'}
        </p>
        {daftar_game && daftar_game.length > 0 && (
          <>
            <p style={{ fontSize: 'var(--font-sm)', fontWeight: '600', color: 'var(--gray-800)', marginBottom: 'var(--spacing-xs)' }}>
              Game Tersedia:
            </p>
            <ul className={styles.gameList}>
              {daftar_game.slice(0, 3).map((game, index) => (
                <li key={index} className={styles.gameItem}>
                  <GameIcon /> {game}
                </li>
              ))}
              {daftar_game.length > 3 && (
                <li className={styles.gameItem}>
                  <GameIcon /> dan {daftar_game.length - 3} lainnya...
                </li>
              )}
            </ul>
          </>
        )}
        <p style={{ fontSize: 'var(--font-sm)', fontWeight: '600', color: 'var(--gray-800)', marginTop: 'var(--spacing-sm)' }}>
          Status: <span className={statusClass}>{status}</span>
        </p>
      </div>
      {status === 'Tersedia' ? (
        <Link to={`/booking/${id}`} className={styles.button}>
          Sewa Sekarang
        </Link>
      ) : (
        <button className={`${styles.button} ${styles.buttonDisabled}`} disabled>
          {status === 'Reserved' ? 'Telah Dipesan' : status === 'Sedang Disewa' ? 'Sedang Disewa' : 'Tidak Tersedia'}
        </button>
      )}
    </div>
  );
};

export default PS5Card;