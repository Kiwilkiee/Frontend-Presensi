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
  const itemsPerPage = 25;
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredKaryawan, setFilteredKaryawan] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Ambil data user
  useEffect(() => {
    axios.get('/user')
      .then(response => {
        setKaryawan(response.data);
        setFilteredKaryawan(response.data);
      });
  }, []);

  // Ambil data absensi saat pertama kali atau saat selectedDate berubah
  useEffect(() => {
    const fetchAbsensi = async () => {
      try {
        let response;

        if (selectedDate) {
          const bulan = moment(selectedDate).month() + 1;
          const tahun = moment(selectedDate).year();
          response = await axios.get('/absensi', {
            params: {
              bulan,
              tahun
            }
          });
        } else {
          response = await axios.get('/absensi');
        }

        setAbsensi(response.data);
      } catch (error) {
        console.error('Error fetching absensi data:', error);
      }
    };

    fetchAbsensi();
  }, [selectedDate]);

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

  const totalPages = Math.ceil(filteredKaryawan.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredKaryawan.slice(indexOfFirstItem, indexOfLastItem);

  const handleDownload = () => {
    const data = absensi.map(item => ({
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
          dateFormat="MM/yyyy"
          showMonthYearPicker
          className="date-picker"
          placeholderText="Pilih Bulan & Tahun"
          isClearable
        />
        <Button variant="primary" className="search-button" onClick={handleDownload}>
          Download Rekap
        </Button>
      </div>
      <Table striped bordered hover className="rekap-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nama</th>
            <th>Hadir</th>
            <th>Izin</th>
            <th>Sakit</th>
            <th>Alpha</th>
            <th>Cuti</th>
            <th>Tidak Ada Jadwal</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((karyawan, index) => {
            const karyawanAbsensi = absensi.filter(item => item.user_id === karyawan.id);

            const totalHadir = karyawanAbsensi.filter(item => item.status === 'Hadir').length;
            const totalIzin = karyawanAbsensi.filter(item => item.status === 'Izin').length;
            const totalSakit = karyawanAbsensi.filter(item => item.status === 'Sakit').length;
            const totalAlpha = karyawanAbsensi.filter(item => item.status === 'Alpha').length;
            const totalCuti = karyawanAbsensi.filter(item => item.status === 'Cuti').length;
            const totalTidakAdaJadwal = karyawanAbsensi.filter(item => item.status_kehadiran === 'Tidak Ada Jadwal').length;

            return (
              <tr key={karyawan.id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{karyawan.nama}</td>
                <td>{totalHadir}</td>
                <td>{totalIzin}</td>
                <td>{totalSakit}</td>
                <td>{totalAlpha}</td>
                <td>{totalCuti}</td>
                <td>{totalTidakAdaJadwal}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className="pagination-container mt-3 d-flex justify-content-center flex-wrap gap-2">
        <Button
          variant="outline-primary"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          First
        </Button>

        <Button
          variant="outline-primary"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((number) => (
            number === 1 ||
            number === totalPages ||
            (number >= currentPage - 2 && number <= currentPage + 2)
          ))
          .map((number, i, arr) => {
            const prev = arr[i - 1];
            const showEllipsis = prev && number - prev > 1;

            return (
              <React.Fragment key={number}>
                {showEllipsis && <span className="mx-2">...</span>}
                <Button
                  variant={number === currentPage ? "primary" : "outline-primary"}
                  onClick={() => handlePageChange(number)}
                >
                  {number}
                </Button>
              </React.Fragment>
            );
          })}

        <Button
          variant="outline-primary"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </Button>

        <Button
          variant="outline-primary"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </Button>
      </div>
    </div>
  );
}

export default RekapPage;
