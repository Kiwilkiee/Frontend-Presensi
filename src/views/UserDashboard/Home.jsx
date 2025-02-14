import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {  FiLogIn, FiLogOut as FiLogout } from 'react-icons/fi';
import { AiOutlineLogout } from 'react-icons/ai';
import { FaUserTie } from 'react-icons/fa';
import { BsClockHistory } from 'react-icons/bs';
import { IoCalendarOutline } from 'react-icons/io5';
import Cookies from 'js-cookie';
import {toast} from 'react-hot-toast';
import Clock from '../../components/Clock';
import axios from '../../api';
import Swal from 'sweetalert2'; // Import SweetAlert2


const Home = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [todayData, setTodayData] = useState([]);
  const [statusAbsensi, setStatusAbsensi] = useState(null);
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');


  useEffect(() => {
  if (userData) {
    setUser(JSON.parse(userData));
  }

  // Fetch attendance data for today
  const fetchTodayData = async () => {
    try {
      const response = await axios.get('/today');
      setTodayData(response.data.data);
    } catch (error) {
      console.error('Error fetching attendance data:', error.response ? error.response.data : error.message);
    }
  };

  if (token) {
    fetchTodayData();
  } else {
    // Handle case where token is not available (e.g., redirect to login)
    navigate('/login');
  }
}, [navigate]);


  const handleAbsenMasuk = async () => {
    try {
      
      
      // Memastikan user_id tersedia
      if (!userData || !token) {
        alert('User ID tidak ditemukan. Silakan login kembali.');
        return;
      }

      const user = JSON.parse(userData);
      const userId = user.id;

      const response = await axios.post('/absensi/masuk', {
        user_id: userId,
      });  
      toast.success('Absen Berhasil Selamat Bekerja', {
        position: "top-right",
        duration: 4000,
      })

    } catch (error) {
      console.error('Error saat absen masuk:', error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 401) {
        alert('Token tidak valid atau telah kedaluwarsa.', {
          position: "top-right",
          duration: 4000,
        });
      } else if (error.response && error.response.status === 400) {
        toast.error("Sudah Absen Masuk Hari Ini.", {
          position: "top-right",
          duration: 4000,
        })

      } else {
        alert('Terjadi kesalahan saat absen masuk.');
      }
    }
  };

  const handleAbsenPulang = async () => {
  try {
    if (!userData || !token) {
      alert('User ID tidak ditemukan. Silakan login kembali.');
      return;
    }

    const user = JSON.parse(userData);
    const userId = user.id;

    const response = await axios.post('/absensi/pulang', {
      user_id: userId,
    });
    toast.success('Absen pulang berhasil', {
      position: "top-right",
      duration: 4000,
    });
  } catch (error) {
    console.error('Error saat absen pulang:', error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 401) {
      ('Token tidak valid atau telah kedaluwarsa.');
    } else if (error.response && error.response.status === 400) {
      toast.error("Sudah Absen Pulang Hari Ini.", {
        position: "top-right",
        duration: 4000,
      })
    } else {
      alert('Terjadi kesalahan saat absen pulang.');
    }
  }
};


  const handleLogout = () => {
          Swal.fire({
              title: 'Apakah yakin ingin keluar?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ya, keluar',
              cancelButtonText: 'Batal'
          }).then((result) => {
              if (result.isConfirmed) {
                  // Hapus token dan user dari cookies dan localStorage
                  Cookies.remove('token');
                  Cookies.remove('user');
                  localStorage.removeItem('user');
                  localStorage.removeItem('token');
      
                  Swal.fire({
                      title: 'Berhasil Logout',
                      text: 'Anda berhasil keluar dari aplikasi.',
                      icon: 'success',
                      timer: 1500,
                      showConfirmButton: false
                  }).then(() => {
                      navigate('/login');
                  });
              }
          });
      };

  return (
    <div className="container" id="appCapsule">
      <div className="section" id="user-section">
        <div className="d-flex align-items-center">
          <div className="avatar">
            <img
              src="https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
              alt="Profile"
              className="imaged w64 rounded"
            />
          </div>
          <div className="ms-3">
            <h2 id="user-name">{user.nama}</h2>
            <span id="user-role">{user.jabatan}</span>
          </div>
        </div>
      </div>

      <div className="section" id="menu-section">
        <div className="card">
          <div className="card-body text-center">
            <div className="row">
              <div className="col-3">
                {/* <div className="menu-icon">
                  <a href="/presensi" className="text-success">
                    <FaUserTie size={40} />
                  </a>
                </div> */}
                <div className="menu-icon">
                  <a href="/profile" className="text-success">
                    <FaUserTie size={40} />
                  </a>
                </div>
                <div className="menu-name">
                  <span>Profil</span>
                </div>
              </div>
              <div className="col-3">
                <div className="menu-icon">
                  <a href="/pengajuan" className="text-danger">
                    <IoCalendarOutline size={40} />
                  </a>
                </div>
                <div className="menu-name">
                  <span>Cuti</span>
                </div>
              </div>
              <div className="col-3">
                <div className="menu-icon">
                  <a href="/history" className="text-warning">
                    <BsClockHistory size={40} />
                  </a>
                </div>
                <div className="menu-name">
                  <span>Histori</span>
                </div>
              </div>
              <div className="col-3">
                <div className="menu-icon">
                  <a onClick={handleLogout} className="text-orange">
                    <AiOutlineLogout size={40} />
                  </a>
                </div>
                <div className="menu-name">
                  <span>Logout</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="clock-container">
          <Clock />
        </div>
      </div>

      <div className="section mt-2" id="presence-section">
        <div className="row">
          <div className="col-6">
            <button
              id="absenButtonMasuk"
              className="card-absensi gradasigreen"
              onClick={handleAbsenMasuk}
            >
              <div className="card-body text-center">
                <div className="iconpresence">
                  <FiLogIn size={24} />
                </div>
                <div className="presencedetail">
                  <h4 className="presencetitle">Masuk</h4>
                </div>
              </div>
            </button>
          </div>

          <div className="col-6">
            <button
              id="absenButtonPulang"
              className="card-absensi gradasired"
              onClick={handleAbsenPulang}
            >
              <div className="card-body text-center">
                <div className="iconpresence">
                  <FiLogout size={24} />
                </div>
                <div className="presencedetail">
                  <h4 className="presencetitle">Pulang</h4>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-4">
          <h4>Absensi Hari Ini</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Jabatan</th>
                <th>Jam Masuk</th>
                <th>Jam Pulang</th>
              </tr>
            </thead>
            <tbody>
              {todayData.length > 0 ? (
                  todayData.map((absensi) => (
                    <tr key={absensi.id}>
                      <td>{absensi.nama}</td>
                      <td>{absensi.jabatan}</td>
                      <td>{absensi.jam_masuk ? new Date(absensi.jam_masuk).toLocaleTimeString() : '-'}</td>
                      <td>{absensi.jam_pulang ? new Date(absensi.jam_pulang).toLocaleTimeString() : '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">Belum yang absen hari ini</td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
