import React from 'react';
import styles from '../../styles/components/OrderDetailsModal.module.css';

const OrderDetailsModal = ({ rental, onClose }) => {
  if (!rental) return null;

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('id-ID', {
      dateStyle: 'full', timeStyle: 'short'
    });
  };

  const { alamat_pengiriman: alamat } = rental;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Detail Pesanan</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.detailGrid}>
            <p><strong>ID Pesanan:</strong> {rental.id}</p>
            <p><strong>Status:</strong> <span className={styles.status}>{rental.status}</span></p>
            <p><strong>User ID:</strong> {rental.user_id}</p>
            <p><strong>Unit ID:</strong> {rental.unit_id}</p>
            <p><strong>Tanggal Pesan:</strong> {formatDate(rental.created_at)}</p>
            <p><strong>Jadwal Sewa:</strong> {new Date(rental.tanggal_mulai).toLocaleDateString('id-ID')} Pukul {rental.jam_mulai}</p>
            <p><strong>Durasi:</strong> {rental.durasi} jam</p>
            <p><strong>Total Biaya:</strong> {formatRupiah(rental.total_biaya)}</p>
            <p><strong>Nomor Kontak:</strong> {rental.nomor_kontak}</p>
          </div>
          
          <div className={styles.addressSection}>
            <h3>Alamat Pengiriman</h3>
            <p>{alamat.jalan}</p>
            <p>Kel. {alamat.kelurahan}, Kec. {alamat.kecamatan}</p>
            <p>{alamat.kota}, {alamat.kode_pos}</p>
            {alamat.patokan && <p><strong>Patokan:</strong> {alamat.patokan}</p>}
          </div>

          {rental.catatan_admin && (
            <div className={styles.adminNotes}>
              <h3>Catatan Admin</h3>
              <p>{rental.catatan_admin}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;