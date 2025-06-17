import React from 'react';
import { useCountdown } from '../../hooks/useCountdown';

const CountdownCell = ({ targetDate, status }) => {
  // Panggil hook di tingkat paling atas (top level) tanpa syarat.
  const { minutes, seconds, isExpired } = useCountdown(targetDate);

  // Lakukan pengecekan kondisi SETELAH semua hook dipanggil.
  if (status !== 'Menunggu Konfirmasi' || !targetDate) {
    return <td>-</td>;
  }

  // Jika waktu sudah habis, tampilkan 'Kadaluarsa'.
  if (isExpired) {
    return <td style={{ color: 'var(--danger-color)', fontWeight: 'bold' }}>Kadaluarsa</td>;
  }

  // Jika semua kondisi terpenuhi, tampilkan countdown.
  return (
    <td style={{ color: 'var(--primary-blue)', fontWeight: 'bold' }}>
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </td>
  );
};

export default CountdownCell;