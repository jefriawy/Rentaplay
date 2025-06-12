// frontend/src/components/ps5/PS5Form.jsx

import React, { useState, useEffect } from 'react';
import styles from '../../styles/pages/AdminDashboard.module.css'; // Akan kita buat/gunakan styles ini

// Komponen form yang dapat digunakan kembali untuk menambah atau mengedit unit PS5
const PS5Form = ({ onSubmit, initialData = {}, isEdit = false, loading }) => {
  const [formData, setFormData] = useState({
    jenis: '',
    nomor_seri: '',
    spesifikasi: '',
    daftar_game: '', // Akan di-parse menjadi array
    kondisi: '',
    harga_sewa: '',
    foto_url: '',
    status: 'Tersedia' // Default status
  });
  const [formError, setFormError] = useState('');

  // Isi form dengan data awal jika ini mode edit
  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        jenis: initialData.jenis || '',
        nomor_seri: initialData.nomor_seri || '',
        spesifikasi: initialData.spesifikasi || '',
        // Join array daftar_game menjadi string untuk input textarea
        daftar_game: Array.isArray(initialData.daftar_game) ? initialData.daftar_game.join(', ') : '',
        kondisi: initialData.kondisi || '',
        harga_sewa: initialData.harga_sewa || '',
        foto_url: initialData.foto_url || '',
        status: initialData.status || 'Tersedia'
      });
    }
  }, [isEdit, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    // Validasi sederhana
    if (!formData.jenis || !formData.nomor_seri || !formData.harga_sewa || !formData.kondisi) {
      setFormError('Jenis, Nomor Seri, Harga Sewa, dan Kondisi wajib diisi.');
      return;
    }
    if (isNaN(Number(formData.harga_sewa)) || Number(formData.harga_sewa) <= 0) {
      setFormError('Harga Sewa harus angka positif.');
      return;
    }

    // Persiapan data untuk disubmit
    const dataToSubmit = {
      ...formData,
      harga_sewa: Number(formData.harga_sewa),
      // Split string daftar_game menjadi array, hapus spasi kosong
      daftar_game: formData.daftar_game.split(',').map(game => game.trim()).filter(game => game !== '')
    };

    onSubmit(dataToSubmit); // Panggil fungsi onSubmit yang diberikan dari parent
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {formError && <p className={styles.errorMessage}>{formError}</p>}

      <div className={styles.formGroup}>
        <label htmlFor="jenis" className={styles.label}>Jenis PS5:</label>
        <select 
          id="jenis"
          name="jenis"
          value={formData.jenis}
          onChange={handleChange}
          className={styles.input}
          required
        >
          <option value="">Pilih Jenis</option>
          <option value="Reguler">Reguler (Disc Edition)</option>
          <option value="Digital">Digital Edition</option>
          <option value="Slim">Slim</option>
          <option value="Pro">Pro (Konsep)</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="nomor_seri" className={styles.label}>Nomor Seri:</label>
        <input
          type="text"
          id="nomor_seri"
          name="nomor_seri"
          value={formData.nomor_seri}
          onChange={handleChange}
          className={styles.input}
          placeholder="Cth: SN-XYZ-12345"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="spesifikasi" className={styles.label}>Spesifikasi:</label>
        <textarea
          id="spesifikasi"
          name="spesifikasi"
          value={formData.spesifikasi}
          onChange={handleChange}
          className={styles.input}
          placeholder="Cth: Model standar dengan disc drive, 825GB SSD."
          rows="3"
        ></textarea>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="daftar_game" className={styles.label}>Daftar Game (Pisahkan dengan koma):</label>
        <textarea
          id="daftar_game"
          name="daftar_game"
          value={formData.daftar_game}
          onChange={handleChange}
          className={styles.input}
          placeholder="Cth: FIFA 24, God of War Ragnarok, Spider-Man 2"
          rows="2"
        ></textarea>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="kondisi" className={styles.label}>Kondisi:</label>
        <select 
          id="kondisi"
          name="kondisi"
          value={formData.kondisi}
          onChange={handleChange}
          className={styles.input}
          required
        >
          <option value="">Pilih Kondisi</option>
          <option value="Baru">Baru</option>
          <option value="Sangat Baik">Sangat Baik</option>
          <option value="Baik">Baik</option>
          <option value="Wajar">Wajar</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="harga_sewa" className={styles.label}>Harga Sewa (per jam, Rp):</label>
        <input
          type="number"
          id="harga_sewa"
          name="harga_sewa"
          value={formData.harga_sewa}
          onChange={handleChange}
          className={styles.input}
          placeholder="Cth: 25000"
          min="0"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="foto_url" className={styles.label}>URL Foto PS5:</label>
        <input
          type="url"
          id="foto_url"
          name="foto_url"
          value={formData.foto_url}
          onChange={handleChange}
          className={styles.input}
          placeholder="Cth: https://placehold.co/300x200/81C784/FFFFFF?text=PS5"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="status" className={styles.label}>Status:</label>
        <select 
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className={styles.input}
          required
        >
          <option value="Tersedia">Tersedia</option>
          <option value="Reserved">Reserved</option>
          <option value="Sedang Disewa">Sedang Disewa</option>
          <option value="Dalam Perbaikan">Dalam Perbaikan</option>
        </select>
      </div>

      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? (isEdit ? 'Mengupdate...' : 'Menambah...') : (isEdit ? 'Update PS5' : 'Tambah PS5')}
      </button>
    </form>
  );
};

export default PS5Form;