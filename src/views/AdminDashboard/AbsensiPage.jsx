import React, { useState, useEffect, useMemo } from 'react';
import axios from '../../api';
import { Table, Pagination, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../style/css/Absensi.css';

function AbsensiPage() {
  const [absensi, setAbsensi] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/absensi')
      .then(response => {
        setAbsensi(response.data);
      })
      .catch(err => {
        setError('Gagal mengambil data absensi');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Kelompokkan absensi berdasarkan tanggal menggunakan useMemo agar tidak menghitung ulang
  const groupedByDate = useMemo(() => {
    return absensi.reduce((acc, item) => {
      const date = new Date(item.jam_masuk).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});
  }, [absensi]);

  const dateList = Object.keys(groupedByDate);
  const totalPages = Math.ceil(dateList.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dateList.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className='absensi-page'>
      <h1>Rekap Absensi</h1>
      <Table striped bordered hover className="absensi-table">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((date, index) => (
            <tr key={index}>
              <td>{date}</td>
              <td>
                <Button 
                  variant="primary" 
                  onClick={() => navigate(`/absensi/detail/${date}`)}
                >
                  Lihat Detail
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="pagination-container">
        <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
        {[...Array(totalPages).keys()].map((number) => (
          <Pagination.Item
            key={number + 1}
            active={number + 1 === currentPage}
            onClick={() => paginate(number + 1)}
          >
            {number + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
      </Pagination>
    </div>
  );
}

export default AbsensiPage;
