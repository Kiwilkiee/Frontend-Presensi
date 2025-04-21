import React, { useEffect, useState } from 'react';
import '../../style/css/Home.css';
import {
  FaUser, FaFileAlt, FaCamera, FaCalendarAlt,
  FaArrowRight, FaClock, FaExclamationCircle
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Api from '../../api';

const HomePage = () => {
  const [user, setUser] = useState({});
  const [greeting, setGreeting] = useState('');
  const [rekap, setRekap] = useState({
    hadir: 0,
    tidak_hadir: 0,
    rata_rata_jam_masuk: '-',
    terlambat: 0,
  });

  const [bulan, setBulan] = useState(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  const namaBulan = new Date(0, bulan - 1).toLocaleString('id-ID', { month: 'long' });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      fetchRekapAbsensi(parsedUser.id, bulan, tahun);
    }

    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) setGreeting('Selamat Pagi');
    else if (hour >= 11 && hour < 15) setGreeting('Selamat Siang');
    else if (hour >= 15 && hour < 18) setGreeting('Selamat Sore');
    else setGreeting('Selamat Malam');
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      fetchRekapAbsensi(parsedUser.id, bulan, tahun);
    }
  }, [bulan, tahun]);

  const fetchRekapAbsensi = (userId, bulan, tahun) => {
    Api.get('/absensi/bulanan', {
      params: {
        user_id: userId,
        bulan,
        tahun
      }
    })
      .then((res) => {
        const data = res.data.data;

        const hadir = data.filter(d => d.jam_masuk !== null).length;

        const tidakHadir = data.filter(d =>
          ['izin', 'sakit', 'cuti', 'alpha'].includes((d.status || '').toLowerCase())
        ).length;

        const terlambat = data.filter(d => {
          if (!d.jam_masuk) return false;
          const [jam, menit] = d.jam_masuk.split(':').map(Number);
          return jam > 7 || (jam === 7 && menit > 0);
        }).length;

        const jamMasukList = data
          .filter(d => d.jam_masuk !== null)
          .map(d => {
            const [h, m] = d.jam_masuk.split(':');
            return parseInt(h) * 60 + parseInt(m);
          });

        let rataRata = '-';
        if (jamMasukList.length > 0) {
          const totalMenit = jamMasukList.reduce((a, b) => a + b, 0);
          const avg = Math.floor(totalMenit / jamMasukList.length);
          const avgJam = String(Math.floor(avg / 60)).padStart(2, '0');
          const avgMenit = String(avg % 60).padStart(2, '0');
          rataRata = `${avgJam}:${avgMenit}`;
        }

        setRekap({
          hadir,
          tidak_hadir: tidakHadir,
          rata_rata_jam_masuk: rataRata,
          terlambat
        });
      })
      .catch((err) => {
        console.error('Gagal ambil presensi bulanan:', err);
      });
  };

  return (
    <div className="home-page">
      <div className="header">
        <p>KaryaOne</p>
      </div>

      <div className="main-container">
        <div className="card">
          <div className="welcome-text">
            <p className="greeting">{greeting}</p>
            <h3 className="username">{user.nama}</h3>
          </div>
          <hr />
          <div className="menu-icons">
            <div className="menu-item" onClick={() => navigate('/profile')}>
              <div className="icon-wrapper"><FaUser className="icon" /></div>
              <div>Profile</div>
            </div>
            <div className="menu-item" onClick={() => navigate('/pengajuan')}>
              <div className="icon-wrapper"><FaFileAlt className="icon" /></div>
              <div>Pengajuan</div>
            </div>
            <div className="menu-item" onClick={() => navigate('/presensi')}>
              <div className="icon-wrapper"><FaCamera className="icon" /></div>
              <div>Absensi</div>
            </div>
            <div className="menu-item" onClick={() => navigate('/history')}>
              <div className="icon-wrapper"><FaCalendarAlt className="icon" /></div>
              <div>History</div>
            </div>
          </div>
        </div>

        <div className="absensi-info">
          <small
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ cursor: 'pointer' }}
          >
            Absensi Bulan <span className="highlight">{namaBulan} {tahun}</span>
          </small>

          {showDropdown && (
            <div className="filters">
              <select value={bulan} onChange={(e) => setBulan(parseInt(e.target.value))}>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
                  </option>
                ))}
              </select>

              <select value={tahun} onChange={(e) => setTahun(parseInt(e.target.value))}>
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="stat-cards">
          <div className="stat-card">
            <div className="stat-title">Hadir</div>
            <div className="stat-row">
              <FaArrowRight className="stat-icon" />
              <div className="stat-value">{rekap.hadir}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Tidak Hadir</div>
            <div className="stat-row">
              <FaUser className="stat-icon" />
              <div className="stat-value">{rekap.tidak_hadir}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Rata Rata Jam Masuk</div>
            <div className="stat-row">
              <FaClock className="stat-icon" />
              <div className="stat-value">{rekap.rata_rata_jam_masuk}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Telat Masuk</div>
            <div className="stat-row">
              <FaExclamationCircle className="stat-icon" />
              <div className="stat-value">{rekap.terlambat}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
