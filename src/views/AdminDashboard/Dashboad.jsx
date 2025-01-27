import React, { useState, useEffect } from 'react';
  import { FaChartBar, FaUsers, FaUserAltSlash } from 'react-icons/fa';
  import { Bar } from 'react-chartjs-2';
  import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import axios from '../../api';
  import '../../style/css/App.css';

  // Register Chart.js components
  ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
const DashboardPage = () => {
  const [jumlahUser, setJumlahUser] = useState(0);
  const [sudahAbsen, setSudahAbsen] = useState(0);
  const [belumAbsen, setBelumAbsen] = useState(0);
  const [averageTime, setAverageTime] = useState({
    masuk: 0, // Nilai default sebagai angka
    pulang: 0, // Nilai default sebagai angka
  });

  useEffect(() => {
    // Ambil data dari API
    axios.get('/dashboard')
      .then(response => {
        setJumlahUser(response.data.jumlah_user || 0);
        setSudahAbsen(response.data.sudah_absen || 0);
        setBelumAbsen(response.data.belum_absen || 0);
        setAverageTime({
          masuk: response.data.average_time?.masuk || 0,
          pulang: response.data.average_time?.pulang || 0,
        });
      })
      .catch(error => {
        console.error('There was an error fetching the dashboard data!', error);
      });
  }, []);

  const data = {
    labels: ['Average Masuk', 'Average Pulang'],
    datasets: [
      {
        label: 'Rata-rata Waktu',
        data: [averageTime.masuk, averageTime.pulang],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

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

      {/* Chart for Average Attendance */}
      <div className="chart-container">
        <h2>Rata-rata Absen Masuk dan Pulang</h2>
        <Bar data={data} />
      </div>
    </div>
  );
};

export default DashboardPage;
