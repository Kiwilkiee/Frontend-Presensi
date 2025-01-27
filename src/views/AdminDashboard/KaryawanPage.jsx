import React, { useState, useEffect } from 'react';
import axios from '../../api';
import { Table, Button, Form, Pagination } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import AddModalUser from '../../components/modals/AddModalUser';

import '../../style/css/Karyawan.css';

function KaryawanPage() {
  const [karyawan, setKaryawan] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKaryawan, setNewKaryawan] = useState({
    nama: '',
    email: '',
    jabatan: '',
  });

  useEffect(() => {
    // Ambil data karyawan dari API
    axios.get('/user')
      .then(response => setKaryawan(response.data));
  }, []);

  const handleAddKaryawanChange = (e) => {
    const { name, value } = e.target;
    setNewKaryawan((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddKaryawanSubmit = async () => {
    try {
      const response = await axios.post('/user', newKaryawan);
      setKaryawan([...karyawan, response.data]);
      setShowAddModal(false);
      Swal.fire('Sukses!', 'Karyawan berhasil ditambahkan', 'success');
    } catch (error) {
      Swal.fire('Error!', 'Terjadi kesalahan saat menambahkan karyawan', 'error');
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
          Swal.fire('Data berhasil dihapus', 'Data karyawan berhasil dihapus', 'success');
        } catch (error) {
          Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus karyawan.', 'error');
        }
      }
    });
  };

  return (
    <div className='karyawan-page'>
      <div className="header-karyawan">
        <h1>Daftar Karyawan</h1>
        <div className="controls">
          <Form.Control
            type="text"
            placeholder="Search by name..."
            className="search-input"
          />
          <Button
            variant="primary"
            className='add-button'
            onClick={() => setShowAddModal(true)}
          >
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
          {karyawan.map((karyawan) => (
            <tr key={karyawan.id}>
              <td>{karyawan.id}</td>
              <td>{karyawan.nama}</td>
              <td>{karyawan.email}</td>
              <td>{karyawan.jabatan}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(karyawan.id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <AddModalUser
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        handleChange={handleAddKaryawanChange}
        handleSubmit={handleAddKaryawanSubmit}
        karyawan={newKaryawan}
      />
    </div>
  );
}

export default KaryawanPage;
