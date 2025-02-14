import React, { useState, useEffect } from 'react';
import axios from '../../api';
import { Table, Pagination, Button, Form } from 'react-bootstrap';
import AdminLayout from '../../layouts/Admin';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import * as XLSX from 'xlsx';
import '../../style/css/Rekap.css';

function RekapPage() {

  document.title = "Rekap - Absensi Indogreen";

  const [karyawan, setKaryawan] = useState([]);
  const [absensi, setAbsensi] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredKaryawan, setFilteredKaryawan] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    axios.get('/user')
      .then(response => {
        setKaryawan(response.data);
        setFilteredKaryawan(response.data);
      });

    axios.get('/absensi')
      .then(response => {
        setAbsensi(response.data);
      })
      .catch(error => console.error('Error fetching absensi data:', error));

  }, []);

  useEffect(() => {
    setFilteredKaryawan(
      karyawan.filter((item) =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setCurrentPage(1);
  }, [searchTerm, karyawan]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAbsensi = selectedDate
    ? absensi.filter(item =>
        moment(item.jam_masuk).format('YYYY-MM-DD') === moment(selectedDate).format('YYYY-MM-DD')
      )
    : absensi;

  const totalPages = Math.ceil(filteredKaryawan.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredKaryawan.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDownload = () => {
    const data = filteredAbsensi.map(item => ({
      ID: item.user_id,
      Nama: karyawan.find(k => k.id === item.user_id)?.nama || '-',
      Tanggal: item.jam_masuk ? moment(item.jam_masuk).format('YYYY-MM-DD') : '-',
      Jam_Masuk: item.jam_masuk ? moment(item.jam_masuk).format('HH:mm:ss') : '-',
      Jam_Pulang: item.jam_pulang ? moment(item.jam_pulang).format('HH:mm:ss') : '-'
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Absensi');

    XLSX.writeFile(workbook, `Rekap_Absensi_${moment().format('YYYY-MM-DD')}.xlsx`);
  };

  return (
    
    <div className='rekap-page'>
      <h1>Rekap Karyawan</h1>
      <div className="controls">
        <Form.Control
          type="text"
          placeholder="Search by name..."
          className="search-input"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="date-picker"
          dateFormat="yyyy-MM-dd"
          placeholderText="Select date"
        />
        <Button variant="primary" className="search-button" onClick={handleDownload}>
          Download Rekap
        </Button>
      </div>
      <Table striped bordered hover className="rekap-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Tanggal</th>
            <th>Jam Masuk</th>
            <th>Jam Pulang</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.flatMap((karyawan) => {
            const karyawanAbsensi = filteredAbsensi.filter(item => item.user_id === karyawan.id);
            
            return karyawanAbsensi.length > 0 
              ? karyawanAbsensi.map((absen, index) => (
                  <tr key={`${karyawan.id}-${index}`}>
                    <td>{karyawan.id}</td>
                    <td>{karyawan.nama}</td>
                    <td>{moment(absen.jam_masuk).format('YYYY-MM-DD')}</td>
                    <td>{moment(absen.jam_masuk).format('HH:mm:ss')}</td>
                    <td>{absen.jam_pulang ? moment(absen.jam_pulang).format('HH:mm:ss') : '-'}</td>
                  </tr>
                ))
              : (
                  <tr key={karyawan.id}>
                    <td>{karyawan.id}</td>
                    <td>{karyawan.nama}</td>
                    <td colSpan="3" style={{ textAlign: 'center' }}>Tidak ada data absensi</td>
                  </tr>
                );
          })}
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

export default RekapPage;
