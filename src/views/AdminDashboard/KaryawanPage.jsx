import React, { useState, useEffect } from 'react';
import axios from '../../api';
import { Table, Button, Form, Dropdown } from 'react-bootstrap';
import { FaPlus, FaTrash, FaEdit, FaUpload, FaUserPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import '../../style/css/Karyawan.css';

function KaryawanPage() {

  document.title = "Karyawan - Absensi Indogreen";

  const [karyawan, setKaryawan] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

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
        <input id="swal-input5" class="swal2-input" placeholder="Divisi" />
        <select id="swal-input4" class="swal2-input">
          <option value="" disabled selected>Pilih Role</option>
          <option value="admin">Admin</option>
          <option value="karyawan">Karyawan</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Tambah',
      cancelButtonText: 'Batal',
      preConfirm: async () => {
        const nama = document.getElementById('swal-input1').value;
        const email = document.getElementById('swal-input2').value;
        const password = document.getElementById('swal-input3').value;
        const role = document.getElementById('swal-input4').value;
        const divisi = document.getElementById('swal-input5').value;

        if (!nama || !email || !password || !role || !divisi) {
          Swal.showValidationMessage('Semua field harus diisi!');
          return false;
        }

        try {
          const response = await axios.post('/user', { nama, email, password, role, divisi });
          return response.data;
        } catch (error) {
          const errMsg = error.response?.data?.message || 'Terjadi kesalahan saat menambahkan karyawan';
          Swal.showValidationMessage(errMsg);
          return false;
        }
      }
    });

    if (formValues) {
      Swal.fire('Sukses!', 'Karyawan berhasil ditambahkan', 'success');
      fetchKaryawan();
    }
  };

  const handleImportKaryawan = async () => {
    const { value: file } = await Swal.fire({
      title: 'Import Karyawan',
      input: 'file',
      inputAttributes: {
        accept: '.xlsx,.xls',
        'aria-label': 'Upload file excel',
      },
      showCancelButton: true,
      confirmButtonText: 'Upload',
      cancelButtonText: 'Batal',
      inputValidator: (value) => {
        if (!value) {
          return 'Silakan pilih file terlebih dahulu';
        }
        const allowedTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (!allowedTypes.includes(value.type)) {
          return 'File harus berupa .xls atau .xlsx';
        }
        return null;
      }
    });

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        await axios.post('/import-user', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Swal.fire('Sukses!', 'Data karyawan berhasil diimport', 'success');
        fetchKaryawan();
      } catch (error) {
        Swal.fire('Gagal!', 'Terjadi kesalahan saat import data', 'error');
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
        <input id="swal-input5" class="swal2-input" placeholder="Divisi" value="${karyawanToEdit.divisi}" />
        <select id="swal-input4" class="swal2-input">
          <option value="admin" ${karyawanToEdit.role === 'admin' ? 'selected' : ''}>Admin</option>
          <option value="karyawan" ${karyawanToEdit.role === 'karyawan' ? 'selected' : ''}>Karyawan</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Batal',
      preConfirm: () => {
        const nama = document.getElementById('swal-input1').value;
        const email = document.getElementById('swal-input2').value;
        const role = document.getElementById('swal-input4').value;
        const divisi = document.getElementById('swal-input5').value;

        if (!nama || !email || !role || !divisi) {
          Swal.showValidationMessage('Semua field harus diisi!');
        }

        return { nama, email, role, divisi };
      }
    });

    if (formValues) {
      try {
        await axios.patch(`/user/${id}`, formValues);
        Swal.fire('Sukses!', 'Data karyawan berhasil diperbarui', 'success');
        fetchKaryawan();
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
          setKaryawan(karyawan.filter(k => k.id !== id));
          Swal.fire('Data berhasil dihapus', 'Data karyawan berhasil dihapus', 'success');
        } catch (error) {
          Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus karyawan.', 'error');
        }
      }
    });
  };

  const filteredKaryawan = karyawan.filter((k) =>
    k.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredKaryawan.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentKaryawan = filteredKaryawan.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className='karyawan-page'>
      <div className="header-karyawan">
        <h1>Daftar Karyawan</h1>
        <div className="controls">
          <Form.Control
            type="text"
            placeholder="Cari berdasarkan nama..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Dropdown>
            <Dropdown.Toggle variant="primary" className="add-button">
              <FaPlus className="me-2" /> Aksi
            </Dropdown.Toggle>

            <Dropdown.Menu className="custom-dropdown">
              <Dropdown.Item onClick={handleImportKaryawan}>
                <FaUpload className="me-2" /> Import Karyawan
              </Dropdown.Item>
              <Dropdown.Item onClick={handleAddKaryawan}>
                <FaUserPlus className="me-2" /> Tambah Karyawan
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <Table striped bordered hover className="karyawan-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Divisi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentKaryawan.map((karyawan, index) => (
            <tr key={karyawan.id}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{karyawan.nama}</td>
              <td>{karyawan.email}</td>
              <td>{karyawan.divisi}</td>
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
        <div className="pagination-container mt-3 d-flex justify-content-center">
          <Button
            variant="outline-primary"
            className="me-2"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            &laquo;
          </Button>

          <Button
            variant="outline-primary"
            className="me-2"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &lsaquo;
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((number) => {
              const delta = 2;
              return (
                number === 1 ||
                number === totalPages ||
                (number >= currentPage - delta && number <= currentPage + delta)
              );
            })
            .map((number, idx, arr) => {
              const prev = arr[idx - 1];
              const isGap = prev && number - prev > 1;
              return (
                <React.Fragment key={number}>
                  {isGap && (
                    <Button variant="light" className="me-2" disabled>
                      ...
                    </Button>
                  )}
                  <Button
                    variant={number === currentPage ? 'primary' : 'outline-primary'}
                    className="me-2"
                    onClick={() => handlePageChange(number)}
                  >
                    {number}
                  </Button>
                </React.Fragment>
              );
            })}

          <Button
            variant="outline-primary"
            className="me-2"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            &rsaquo;
          </Button>

          <Button
            variant="outline-primary"
            className="me-2"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            &raquo;
          </Button>
        </div>
    </div>
  );
}

export default KaryawanPage;
