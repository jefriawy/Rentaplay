import React from 'react';
import styles from '../../styles/components/OrderCard.module.css';
import { useCountdown } from '../../hooks/useCountdown';

const OrderCard = ({ rental }) => {
  const { minutes, seconds, isExpired } = useCountdown(rental.konfirmasi_kadaluarsa_at);

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  let statusClass;
  let currentStatus = rental.status;

  if (currentStatus === 'Menunggu Konfirmasi' && isExpired) {
    currentStatus = 'Kadaluarsa';
  }

  switch (currentStatus) {
    case 'Menunggu Konfirmasi':
      statusClass = styles.statusWaiting; // Kuning
      break;
    case 'Dikonfirmasi':
      statusClass = styles.statusSuccess; // Hijau
      break;
    case 'Ditolak':
    case 'Dibatalkan':
    case 'Kadaluarsa':
      statusClass = styles.statusFailed; // Merah
      break;
    case 'Sedang Disewa':
      statusClass = styles.statusRented; // Biru
      break;
    default:
      statusClass = styles.statusDefault;
  }

  return (
    <div className={`${styles.card} ${statusClass}`}>
      <div className={styles.header}>
        <h3>Pesanan #{rental.id.substring(0, 8)}...</h3>
        <span className={styles.statusBadge}>{currentStatus}</span>
      </div>
      <div className={styles.body}>
        <p><strong>Tanggal Pesan:</strong> {formatDate(rental.created_at)}</p>
        <p><strong>Jadwal Sewa:</strong> {formatDate(rental.tanggal_mulai)} pukul {rental.jam_mulai}</p>
        <p><strong>Durasi:</strong> {rental.durasi} jam</p>
        <p><strong>Total Biaya:</strong> {formatRupiah(rental.total_biaya)}</p>
      </div>
      <div className={styles.footer}>
        {currentStatus === 'Menunggu Konfirmasi' && (
          <div className={styles.countdown}>
            Sisa waktu konfirmasi: <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
          </div>
        )}
        {currentStatus === 'Kadaluarsa' && (
            <p className={styles.infoTextFailed}>Waktu konfirmasi habis. Pesanan dibatalkan.</p>
        )}
        {currentStatus === 'Dikonfirmasi' && (
          <button className={styles.paymentButton}>Lanjut ke Pembayaran</button>
        )}
        {currentStatus === 'Ditolak' && (
          <div className={styles.infoTextFailed}>
            <p style={{ margin: 0 }}>Pesanan Anda ditolak oleh admin.</p>
            {/* Tampilkan alasan penolakan jika ada */}
            {rental.catatan_admin && (
              <p className={styles.adminNote}>
                <strong>Alasan:</strong> "{rental.catatan_admin}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;