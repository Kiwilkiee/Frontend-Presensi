import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Swal from 'sweetalert2';
import Header from '../../components/Header';

// Atur ikon default Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Komponen untuk mengubah posisi map
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 15);
  return null;
}

// Komponen untuk memperbaiki ukuran map saat render pertama
function FixLeafletMap() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [map]);
  return null;
}

const Presensi = () => {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLoading(false);
        },
        (err) => {
          console.error("Lokasi tidak bisa diakses", err);
          setLoading(false);
          Swal.fire({
            icon: 'error',
            title: 'Gagal Mengambil Lokasi',
            text: 'Pastikan akses lokasi diizinkan di browser kamu.',
          });
        }
      );
    }
  }, []);

  const tanggalHariIni = new Date().toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container">
      <Header title="Presensi" />

      {/* Kartu selamat pagi */}
      <div className="card mb-3 mt-4 shadow-sm rounded-4 px-3">
        <div className="card-body">
          <h6 className="text-start">Selamat Pagi</h6>
          <hr className="my-2" />
          <div className="d-flex justify-content-between">
            <span>Tanggal</span>
            <span>{tanggalHariIni}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Jam Masuk Hari ini</span>
            <span>07.00</span>
          </div>
        </div>
      </div>

      {/* Kartu lokasi */}
      <div className="card shadow-sm rounded-4 px-3 mb-3">
        <div className="card-body">
          <h6 className="text-start mb-2">Ayo Ambil Lokasi Kamu</h6>
          <hr className="my-2" />
          {position && (
            <MapContainer center={position} zoom={15} style={{ height: '200px', width: '100%' }}>
              <ChangeView center={position} />
              <FixLeafletMap />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              <Marker position={position}></Marker>
            </MapContainer>
          )}

          <div className="text-center mt-3">
            <button className="btn btn-primary rounded-pill px-5">Selanjutnya</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presensi;
