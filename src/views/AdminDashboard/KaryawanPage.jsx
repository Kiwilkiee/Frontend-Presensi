import React, { useState, useEffect } from 'react';
import axios from '../../api';
import { Table, Button, Form, Pagination } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import TambahKaryawan from '../../components/modals/TambahKaryawan';
import EditKaryawan from '../../components/modals/EditKaryawan';

import '../../style/css/Karyawan.css';


function KaryawanPage() {
  const [karyawan, setKaryawan] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentKaryawan, setCurrentKaryawan] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredKaryawan, setFilteredKaryawan] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // Ambil data karyawan dari API
    axios.get('/user')
      .then(response => {
        setKaryawan(response.data);
        setFilteredKaryawan(response.data); // Set filteredKaryawan saat data karyawan didapat
      });
  }, []);

  useEffect(() => {
    // Filter karyawan berdasarkan searchTerm
    setFilteredKaryawan(
      karyawan.filter((item) =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setCurrentPage(1); // Reset halaman ke 1 setiap kali ada pencarian baru
  }, [searchTerm, karyawan]);

  const handleAddKaryawan = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = (newKaryawan) => {
    setShowAddModal(false);
    if (newKaryawan) {
      setKaryawan([...karyawan, newKaryawan]);
    }
  };

  const handleEdit = (karyawan) => {
    setCurrentKaryawan(karyawan);
    setShowEditModal(true);
  };

  const handleCloseEditModal = (updateKaryawan) => {
    setShowEditModal(false);
    if (updateKaryawan) {
      const updatedKaryawans = karyawan.map((karyawan) => {
        if (karyawan.id === updateKaryawan.id) {
          return updateKaryawan;
        }
        return karyawan;
      });
      setKaryawan(updatedKaryawans);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Anda tidak dapat mengembalikan data yang telah dihapus!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/user/${id}`);
          setKaryawan(karyawan.filter(k => k.id !== id));
          Swal.fire(
            'Data berhasil dihapus',
            'Data karyawan berhasil dihapus',
            'success'
          );
        } catch (error) {
          Swal.fire(
            'Gagal!',
            'Terjadi kesalahan saat menghapus karyawan.',
            'error'
          );
        }
      }
    });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredKaryawan.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredKaryawan.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='karyawan-page'>
      <div className="header-karyawan">
        <h1>Daftar Karyawan</h1>
        <div className="controls">
          <Form.Control
            type="text"
            placeholder="Search by name..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button
            variant="primary"
            className='add-button'
            onClick={handleAddKaryawan}>
            <FaPlus /> Tambah Karyawan
          </Button>
        </div>
      </div>
      <Table striped bordered hover className="karyawan-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Jabatan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((karyawan) => (
            <tr key={karyawan.id}>
              <td>{karyawan.id}</td>
              <td>{karyawan.nama}</td>
              <td>{karyawan.email}</td>
              <td>{karyawan.jabatan}</td>
              <td>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => handleEdit(karyawan)}>
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(karyawan.id)}>
                  <FaTrash />
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

      <TambahKaryawan show={showAddModal} handleClose={handleCloseAddModal} />
      <EditKaryawan show={showEditModal} handleClose={handleCloseEditModal} karyawan={currentKaryawan} />
    </div>
  );
}

export default KaryawanPage;
