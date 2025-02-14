import React, { useState, useEffect } from 'react';
import axios from '../../api';
import { Table, Button, Form } from 'react-bootstrap';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';
import '../../style/css/Karyawan.css';

function KaryawanPage() {

  document.title = "Karyawan - Absensi Indogreen";

  const [karyawan, setKaryawan] = useState([]);

  useEffect(() => {
    fetchKaryawan();
  }, []);                                                                                                                     
                                                                                                                            
  const fetchKaryawan = () => {
    axios.get('/user')
      .then(response => setKaryawan(response.data))
      .catch(error => console.error('Gagal mengambil data karyawan:', error));
  };

  const handleAddKaryawan = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Tambah Karyawan Baru',
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Nama" />
        <input id="swal-input2" class="swal2-input" placeholder="Email" />
        <input id="swal-input3" type="password" class="swal2-input" placeholder="Password" />
        <input id="swal-input5" class="swal2-input" placeholder="Jabatan" />
        <select id="swal-input4" class="swal2-input">
          <option value="" disabled selected>Pilih Role</option>
          <option value="admin">Admin</option>
          <option value="karyawan">Karyawan</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: 'Close',
      confirmButtonText: 'Tambah',
      preConfirm: () => {
        const nama = document.getElementById('swal-input1').value;
        const email = document.getElementById('swal-input2').value;
        const password = document.getElementById('swal-input3').value;
        const role = document.getElementById('swal-input4').value;
        const jabatan = document.getElementById('swal-input5').value;

        if (!nama || !email || !password || !role || !jabatan) {
          Swal.showValidationMessage('Semua field harus diisi!');
        }

        return { nama, email, password, role, jabatan };
      }
    });

    if (formValues) {
      try {
        const response = await axios.post('/user', formValues);
        setKaryawan([...karyawan, response.data]); // Tambahkan data baru ke state
        Swal.fire('Sukses!', 'Karyawan berhasil ditambahkan', 'success');
      } catch (error) {
        Swal.fire('Error!', 'Terjadi kesalahan saat menambahkan karyawan', 'error');
      }
    }
  };

  const handleEdit = async (id) => {
    const karyawanToEdit = karyawan.find((k) => k.id === id);

    const { value: formValues } = await Swal.fire({
      title: 'Edit Karyawan',
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Nama" value="${karyawanToEdit.nama}" />
        <input id="swal-input2" class="swal2-input" placeholder="Email" value="${karyawanToEdit.email}" />
        <input id="swal-input5" class="swal2-input" placeholder="Jabatan" value="${karyawanToEdit.jabatan}" />
        <select id="swal-input4" class="swal2-input">
          <option value="admin" ${karyawanToEdit.role === 'admin' ? 'selected' : ''}>Admin</option>
          <option value="karyawan" ${karyawanToEdit.role === 'karyawan' ? 'selected' : ''}>Karyawan</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: 'Close',
      confirmButtonText: 'Update',
      preConfirm: () => {
        const nama = document.getElementById('swal-input1').value;
        const email = document.getElementById('swal-input2').value;
        const role = document.getElementById('swal-input4').value;
        const jabatan = document.getElementById('swal-input5').value;

        if (!nama || !email || !role || !jabatan) {
          Swal.showValidationMessage('Semua field harus diisi!');
        }

        return { nama, email, role, jabatan };
      }
    });

    if (formValues) {
      try {
        const response = await axios.put(`/user/${id}`, formValues);
        setKaryawan(karyawan.map((k) => (k.id === id ? response.data : k))); // Perbarui state dengan data yang telah diubah
        Swal.fire('Sukses!', 'Data karyawan berhasil diperbarui', 'success');
      } catch (error) {
        Swal.fire('Error!', 'Terjadi kesalahan saat memperbarui data karyawan', 'error');
      }
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
          setKaryawan(karyawan.filter(k => k.id !== id)); // Hapus data dari state
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
            onClick={handleAddKaryawan}
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
                  variant="warning"
                  className="me-2"
                  onClick={() => handleEdit(karyawan.id)}
                >
                  <FaEdit />
                </Button>
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
    </div>
  );
}

export default KaryawanPage;
