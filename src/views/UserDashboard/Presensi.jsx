import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header';
import Api from '../../api';
import Swal from 'sweetalert2';

const Presensi = () => {
  const [step, setStep] = useState(1);
  const videoRef = useRef(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [imageBlob, setImageBlob] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [location, setLocation] = useState(null);
  const [statusPresensi, setStatusPresensi] = useState('masuk');
  const [feedback, setFeedback] = useState(null);
  const [presensiSelesai, setPresensiSelesai] = useState(false);

  useEffect(() => {
    const savedStatus = localStorage.getItem('statusPresensi');
    if (savedStatus) {
      setStatusPresensi(savedStatus);
      if (savedStatus === 'selesai') {
        setPresensiSelesai(true);
      }
    }
  }, []);

  useEffect(() => {
    if (step === 1 && !presensiSelesai && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Kamera tidak bisa diakses", err);
          Swal.fire({
            icon: 'error',
            title: 'Akses Kamera Gagal',
            text: 'Pastikan kamu sudah mengizinkan akses kamera di browser.',
          });
        });
    }
  }, [step, presensiSelesai]);

  const ambilFoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      setImageBlob(blob);
      setPhotoTaken(true);

      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
          setStep(2);
          setLoadingLocation(false);
        },
        (err) => {
          console.error("Gagal mengambil lokasi", err);
          setLoadingLocation(false);
          Swal.fire({
            icon: 'error',
            title: 'Gagal Mengambil Lokasi',
            text: 'Pastikan kamu mengizinkan akses lokasi pada browser.',
          });
        }
      );
    }, 'image/png');
  };

  const handleAbsen = async () => {
    if (!location || !imageBlob) return;
  
    const formData = new FormData();
    formData.append('latitude', location.latitude);
    formData.append('longitude', location.longitude);
    if (statusPresensi === 'masuk') {
      formData.append('foto_masuk', imageBlob, 'foto_masuk.png');
    } else {
      formData.append('foto_pulang', imageBlob, 'foto_pulang.png');
    }
  
    try {
      const response = await Api.post(`/absensi/${statusPresensi}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
  
      setFeedback(response.data.message);
  
      // ✅ SweetAlert success
      Swal.fire({
        icon: 'success',
        title: `Berhasil Absen ${statusPresensi === 'masuk' ? 'Masuk' : 'Pulang'}`,
        text: response.data.message,
        timer: 2000,
        showConfirmButton: false,
      });
  
      // Update status presensi
      if (statusPresensi === 'masuk') {
        setStatusPresensi('pulang');
        localStorage.setItem('statusPresensi', 'pulang');
      } else {
        setStatusPresensi('selesai');
        setPresensiSelesai(true);
        localStorage.setItem('statusPresensi', 'selesai');
      }
  
      // Reset tampilan ke awal
      setStep(1);
      setPhotoTaken(false);
      setImageBlob(null);
      setLocation(null);
    } catch (err) {
      console.error('Gagal absen:', err);
  
      const errorMessage =
        err?.response?.data?.message || 'Terjadi kesalahan saat mengirim presensi.';
  
      Swal.fire({
        icon: 'error',
        title: 'Gagal Absen',
        text: errorMessage,
      });
  
      setStep(1);
      setPhotoTaken(false);
      setImageBlob(null);
      setLocation(null);
    }
  };

  const tanggalHariIni = new Date().toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  return (
    <div className="container">
      <Header title="Presensi" />

      <div className="card mb-3 mt-4 shadow-sm rounded-4 px-3">
        <div className="card-body">
          <h6 className="text-start">Selamat {statusPresensi === 'masuk' ? 'Pagi' : 'Sore'}</h6>
          <hr className="my-2" />
          <div className="d-flex justify-content-between">
            <span>Tanggal</span>
            <span>{tanggalHariIni}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Jam Masuk Hari ini</span>
            <span>07.00</span>
          </div>
          <div className="d-flex justify-content-between mb-3">
            <span>Status</span>
            <span className={`badge bg-${statusPresensi === 'masuk' ? 'warning' : statusPresensi === 'pulang' ? 'success' : 'secondary'}`}>
              {statusPresensi === 'masuk' ? 'Absen Masuk' :
                statusPresensi === 'pulang' ? 'Absen Pulang' : 'Selesai'}
            </span>
          </div>

          {presensiSelesai ? (
            <div className="text-center my-4">
              <h5 className="text-success fw-bold">✅ Kamu sudah menyelesaikan presensi hari ini.</h5>
              <p className="text-muted">Sampai jumpa besok!</p>
            </div>
          ) : step === 1 ? (
            <div className="text-center">
              <h6>Ambil Foto Kamu</h6>
              <hr />
              {!photoTaken ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    style={{ width: '100%', borderRadius: '12px' }}
                  />
                  <button className="btn btn-success mt-3" onClick={ambilFoto}>
                    Ambil Foto
                  </button>
                </>
              ) : (
                <p className="text-muted">Mengambil lokasi...</p>
              )}
            </div>
          ) : (
            step === 2 && location && (
              <>
                <div className="mt-3">
                  <h6>Lokasi Terdeteksi</h6>
                  <hr />
                  <p>Latitude: {location.latitude}</p>
                  <p>Longitude: {location.longitude}</p>
                </div>

                <div className="text-center mt-3">
                  <button
                    className="btn btn-primary rounded-pill px-5"
                    disabled={loadingLocation}
                    onClick={handleAbsen}
                  >
                    {statusPresensi === 'masuk' ? 'Absen Masuk' : 'Absen Pulang'}
                  </button>
                </div>
              </>
            )
          )}

          
        </div>
      </div>
    </div>
  );
};

export default Presensi;
