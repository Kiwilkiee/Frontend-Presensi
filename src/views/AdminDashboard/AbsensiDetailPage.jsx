import React, { useState, useEffect } from 'react';
import axios from '../../api';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

function AbsensiDetailPage() {
  const { date } = useParams();
  const [absensi, setAbsensi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const formattedDate = new Date(date).toISOString().split('T')[0];

    axios.post('/rekap/ByDate', { tanggal: date })
      .then(response => {
        setAbsensi(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [date]);
  
  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className='absensi-page'>
      <h1>Detail Absensi - {date}</h1>
      <Button variant="secondary" onClick={() => navigate(-1)}>Kembali</Button>
      <Table striped bordered hover className="absensi-table mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Jam Masuk</th>
            <th>Jam Pulang</th>
          </tr>
        </thead>
        <tbody>
          {absensi.length > 0 ? (
            absensi.map((item) => (
              <tr key={item.id}>
                <td>{item.user.id}</td>
                <td>{item.user.nama}</td>
                <td>{item.jam_masuk ? new Date(item.jam_masuk).toLocaleTimeString('id-ID') : '-'}</td>
                <td>{item.jam_pulang ? new Date(item.jam_pulang).toLocaleTimeString('id-ID') : '-'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">Tidak ada data absensi untuk tanggal ini</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default AbsensiDetailPage;
