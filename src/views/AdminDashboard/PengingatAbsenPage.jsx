import React, { useEffect, useState } from 'react';
import axios from '../../api';
import Swal from 'sweetalert2';


function PesanPengingatPage() {
  const [pesan, setPesan] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);


  useEffect(() => {
    axios.get('/pesan-pengingat')
      .then(res => {
        setPesan(res.data?.pesan || '');
        setLoading(false);
      })
      .catch(err => {
        console.error('Gagal ambil pesan:', err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = () => {
    axios.post('/pesan-pengingat', { pesan })
      .then(res => {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: res.data.message
        });
      })
      .catch(err => {
        console.error('Gagal simpan pesan:', err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Terjadi kesalahan saat menyimpan pesan.'
        });
      });
  };
  
  const handleKirimUlangSemua = () => {
    Swal.fire({
      title: 'Kirim Ulang?',
      text: "Yakin ingin mengirim ulang email ke semua yang belum absen?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, kirim sekarang!'
    }).then((result) => {
      if (result.isConfirmed) {
        setSending(true);
        axios.post('/pengingat-absen/kirim-ulang')
          .then(res => {
            Swal.fire({
              icon: 'success',
              title: 'Berhasil',
              text: res.data.message
            });
          })
          .catch(err => {
            console.error('Gagal kirim ulang email:', err);
            Swal.fire({
              icon: 'error',
              title: 'Gagal',
              text: 'Terjadi kesalahan saat mengirim ulang email.'
            });
          })
          .finally(() => {
            setSending(false);
          });
      }
    });
  };
  

  return (
    <div className="container mt-4">
      <h3>Edit Pesan Pengingat Absen</h3>
      {loading ? (
        <p>Memuat...</p>
      ) : (
        <>
          <textarea
            className="form-control mb-3"
            rows={5}
            value={pesan}
            onChange={(e) => setPesan(e.target.value)}
          />
        <div className="d-flex justify-content-between mb-3">
            <button className="btn btn-primary" onClick={handleSubmit}>
                Simpan Pesan
            </button>
            <button className="btn btn-success" onClick={handleKirimUlangSemua} disabled={sending}>
                {sending ? 'Mengirim...' : 'Kirim Ulang Semua'}
            </button>
        </div>
        </>
      )}
    </div>
  );
}

export default PesanPengingatPage;
