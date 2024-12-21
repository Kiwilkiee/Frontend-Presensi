import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api'; 
import Header from '../../components/Header';
function History() {
    document.title = "History - Absensi Indogreen";

    const navigate = useNavigate();
    const [historyData, setHistoryData] = useState([]);
    const [user, setUser] = useState(null);
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    useEffect(() => {
        if (userData) {
            setUser(JSON.parse(userData));
        }

        const fetchHistoryData = async () => {
            try {
                const userId = JSON.parse(userData).id; // Mengambil userId dari localStorage
                const response = await axios.get(`/absensi/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setHistoryData(response.data);
            } catch (error) {
                console.error('Error fetching history data:', error.response ? error.response.data : error.message);
            }
        };

        if (token) {
            fetchHistoryData();
        } else {
            navigate('/login');
        }
    }, [navigate, userData, token]);

    const getStatusClass = (absensi) => {
        if (absensi.jam_masuk && absensi.jam_pulang) {
            return 'Hadir'; // Status Hadir
        } else if (absensi.jam_masuk && !absensi.jam_pulang) {
            return 'Progress'; // Status Proses
        } else {
            return 'status-tidak-hadir'; // Status Tidak Hadir jika perlu
        }
    };

    return (
        <>
            <div className='container'>
                <Header title="History" />

                <div className="background-container mt-4">
                    <h4>Riwayat Absensi</h4>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>Jam Masuk</th>
                                <th>Jam Pulang</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyData.length > 0 ? (
                                historyData.map((absensi) => (
                                    <tr key={absensi.id}>
                                        <td>{absensi.jam_masuk ? new Date(absensi.jam_masuk).toLocaleDateString() : '-'}</td>
                                        <td>{absensi.jam_masuk ? new Date(absensi.jam_masuk).toLocaleTimeString() : '-'}</td>
                                        <td>{absensi.jam_pulang ? new Date(absensi.jam_pulang).toLocaleTimeString() : '-'}</td>
                                        <td>
                                            <span className={`status ${getStatusClass(absensi)}`}>
                                                {getStatusClass(absensi).replace(/-/g, ' ').toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">Tidak ada data absensi untuk user ini.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default History;
