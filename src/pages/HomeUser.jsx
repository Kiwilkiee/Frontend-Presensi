import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FiUser, FiFileText, FiLogIn, FiLogOut as FiLogout } from 'react-icons/fi';
import { AiOutlineLogout } from 'react-icons/ai';
import { FaUserTie } from 'react-icons/fa';
import { BsClockHistory } from 'react-icons/bs';
import { IoCalendarOutline } from 'react-icons/io5';
import '../css/index.css'; // Adjust the path as necessary

const HomeUser = () => {
  const [user, setUser] = useState({ name: '', role: '' });
  // Dummy data for attendance
  const dummyAttendanceData = [
    {
      id: 1,
      nama: 'John Doe',
      jabatan: 'Software Engineer',
      jam_masuk: '08:00',
      jam_pulang: '17:00',
    },
    {
      id: 2,
      nama: 'Jane Smith',
      jabatan: 'Product Manager',
      jam_masuk: '09:00',
      jam_pulang: '18:00',
    },
    {
      id: 3,
      nama: 'Michael Johnson',
      jabatan: 'UX Designer',
      jam_masuk: '10:00',
      jam_pulang: '19:00',
    },
  ];

  useEffect(() => {
    // Retrieve user data from local storage
    // const userData = localStorage.getItem('user');
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser({ nama: userData.nama || 'Nama', jabatan: userData.jabatan || 'Jabatan' });
    }
  }, []);

  const handleAbsenMasuk = () => {
    console.log("Absen Masuk clicked");
  };

  const handleAbsenPulang = () => {
    console.log("Absen Pulang clicked");
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
                  <a href="/logout" className="text-orange">
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
              {dummyAttendanceData.map((attendance) => (
                <tr key={attendance.id}>
                  <td>{attendance.nama}</td>
                  <td>{attendance.jabatan}</td>
                  <td>{attendance.jam_masuk || '-'}</td>
                  <td>{attendance.jam_pulang || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HomeUser;
