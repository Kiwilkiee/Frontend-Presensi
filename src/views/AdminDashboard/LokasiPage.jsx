import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, useMap } from 'react-leaflet';
import { Card, Button } from 'react-bootstrap';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Api from '../../api'; 

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function RecenterMap({ lat, lng }) {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 16);
    }
  }, [lat, lng, map]);

  return null;
}

function LocationSelector({ setLat, setLng }) {
  useMapEvents({
    click(e) {
      setLat(e.latlng.lat);
      setLng(e.latlng.lng);
    },
  });
  return null;
}

function LokasiPage() {
  const [latitude, setLatitude] = useState(-6.2);
  const [longitude, setLongitude] = useState(106.8);
  const [radius, setRadius] = useState(100);

  useEffect(() => {
    const fetchLokasi = async () => {
      try {
        const res = await Api.get('/lokasi');
        const result = res.data;
        if (result.data) {
          setLatitude(result.data.latitude);
          setLongitude(result.data.longitude);
          setRadius(result.data.radius);
        }
      } catch (err) {
        console.error('Gagal mengambil data lokasi', err);
      }
    };

    fetchLokasi();
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await Api.post('/update-lokasi', {
        latitude,
        longitude,
        radius,
      });

      alert(res.data.message);
    } catch (error) {
      console.error(error);
      alert('Gagal mengatur lokasi');
    }
  };

  return (
    <div className="container mt-4">
      <h4>Pengaturan Lokasi Absensi</h4>
      <hr />
      <Card className="p-3 mb-3">
        <div className="mb-3">
          <label>Latitude</label>
          <input
            type="number"
            value={latitude}
            onChange={(e) => setLatitude(parseFloat(e.target.value))}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label>Longitude</label>
          <input
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(parseFloat(e.target.value))}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label>Radius (meter)</label>
          <input
            type="number"
            value={radius}
            onChange={(e) => {
              const val = e.target.value;
              setRadius(val === '' ? '' : parseInt(val));
            }}
            className="form-control"
          />
        </div>
        <Button onClick={handleSubmit} variant="primary">Atur Lokasi</Button>
      </Card>

      <MapContainer center={[latitude, longitude]} zoom={16} style={{ height: '400px' }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap lat={latitude} lng={longitude} />
        <LocationSelector setLat={setLatitude} setLng={setLongitude} />
        <Marker position={[latitude, longitude]} />
        <Circle center={[latitude, longitude]} radius={radius || 0} />
      </MapContainer>
    </div>
  );
}

export default LokasiPage;
