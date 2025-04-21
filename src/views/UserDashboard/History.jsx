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
                const userId = JSON.parse(userData).id;
                const response = await axios.get(`/absensi/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
        
                // Urutkan dari yang terbaru ke yang lama berdasarkan created_at
                const sortedData = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
                setHistoryData(sortedData);
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

    const getStatusClass = (status) => {
        switch (status) {
            case 'Hadir':
                return 'status-hadir';
            case 'Proses':
                return 'status-proses';
            case 'Izin':
                return 'status-izin';
            case 'Sakit':
                return 'status-sakit';
            case 'Alpha':
                return 'status-alpha';
            default:
                return 'status-unknown';
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
                                historyData.map((presensi) => (
                                    <tr key={presensi.id}>
                                        <td>{presensi.tanggal ?? '-'}</td>
                                        <td>{presensi.jam_masuk ? presensi.jam_masuk.slice(0, 5) : '-'}</td>
                                        <td>{presensi.jam_pulang ? presensi.jam_pulang.slice(0, 5) : '-'}</td>
                                        <td>
                                            <span className={`status ${getStatusClass(presensi.status)}`}>
                                                {presensi.status?.toUpperCase() || 'TIDAK DIKETAHUI'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">Tidak ada data presensi untuk user ini.</td>
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
