import React, { useState, useEffect } from 'react';
import { FaChartBar, FaUsers, FaUserAltSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from '../../api';

 import '../../style/css/App.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  
  const [jumlahUser, setJumlahUser] = useState(0);
  const [sudahAbsen, setSudahAbsen] = useState(0);
  const [belumAbsen, setBelumAbsen] = useState(0);

  useEffect(() => {
    // Ambil data dari API
    axios.get('/dashboard')
      .then(response => {
        setJumlahUser(response.data.jumlah_user);
        setSudahAbsen(response.data.sudah_absen);
        setBelumAbsen(response.data.belum_absen);
      })
      .catch(error => {
        console.error("There was an error fetching the dashboard data!", error);
      });
  }, []);

  //const handleRegistrasiClick = () => {
    //navigate('/TambahKaryawan');
  //};

  return (
    <div className="dashboard-container">
      <h1>Welcome To Dashboard Admin</h1>
      <div className="box-container">
        <div className="box">
          <FaUsers className="box-icon" />
          <div className="box-content">
            <span className="box-number">{jumlahUser}</span>
            <span className="box-label">Total Karyawan</span>
          </div>
        </div>
        <div className="box">
          <FaChartBar className="box-icon" />
          <div className="box-content">
            <span className="box-number">{sudahAbsen}</span>
            <span className="box-label">Sudah Absen</span>
          </div>
        </div>
        <div className="box">
          <FaUserAltSlash className="box-icon" />
          <div className="box-content">
            <span className="box-number">{belumAbsen}</span>
            <span className="box-label">Belum Absen</span>
          </div>
        </div>
      </div>
      {/* Grafik dan Pending Registrasi bisa ditambahkan di sini */}
    </div>
  );
};

export default DashboardPage;
