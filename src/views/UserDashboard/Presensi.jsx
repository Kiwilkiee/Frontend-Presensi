import React, { useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import Header from '../../components/Header';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon issue in React environment
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Presensi = () => {
  const [screenshot, setScreenshot] = useState(null);
  const [position, setPosition] = useState({ lat: 0, lng: 0 });  
  // Webcam reference
  const webcamRef = React.useRef(null);

  // Capture image from webcam
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setScreenshot(imageSrc);
  }, [webcamRef]);

  // Get user's current position using Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    }
  }, []);

  // Function to move map to user's position
  function ChangeView({ center }) {
    const map = useMap();
    map.setView(center, 15);
    return null;
  }

  return (
    <>
      <div className="container">
        <Header title={'Presensi'} />
        
        {/* Webcam Section */}
        <div className="webcam-container">
          <h3>Ambil Foto Presensi</h3>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            height={400}
            width="100%"
          />
          <button onClick={capture}>Ambil Foto</button>
          {screenshot && (
            <div>
              <h4>Foto yang diambil:</h4>
              <img src={screenshot} alt="Webcam screenshot" width="100%" />
            </div>
          )}
        </div>

        {/* Leaflet Map Section */}
        <div className="map-container" style={{ marginTop: '20px' }}>
          <h3>Lokasi Anda (Leaflet Map)</h3>
          <MapContainer
            center={position}
            zoom={15}
            style={{ height: '400px', width: '100%' }}
          >
            <ChangeView center={position} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}></Marker>
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default Presensi;
