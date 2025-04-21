import React, { useEffect, useState } from 'react';
import axios from '../../api';
import { Button, Form, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';

function JadwalKerja() {
  const [jadwalList, setJadwalList] = useState([]);
  const [formData, setFormData] = useState({
    hari: '',
    jam_masuk: '',
  });

  const getJadwalKerja = async () => {
    try {
      const response = await axios.get('/jadwal-kerja');
      setJadwalList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/jadwal-kerja', formData);
      Swal.fire('Berhasil', res.data.message, 'success');
      setFormData({ hari: '', jam_masuk: '' });
      getJadwalKerja();
    } catch (err) {
      console.error(err);
      Swal.fire('Gagal', 'Terjadi kesalahan', 'error');
    }
  };

  const handleDelete = async (hari) => {
    try {
      await axios.delete(`/jadwal-kerja/${hari}`);
      Swal.fire('Dihapus', 'Jadwal berhasil dihapus', 'success');
      getJadwalKerja();
    } catch (err) {
      console.error(err);
      Swal.fire('Gagal', 'Tidak bisa menghapus jadwal', 'error');
    }
  };

  useEffect(() => {
    getJadwalKerja();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Jadwal Kerja</h3>
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Hari</Form.Label>
          <Form.Control
            type="text"
            name="hari"
            value={formData.hari}
            onChange={handleInput}
            placeholder="Contoh: Senin"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Jam Masuk</Form.Label>
          <Form.Control
            type="time"
            name="jam_masuk"
            value={formData.jam_masuk}
            onChange={handleInput}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">Simpan</Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Hari</th>
            <th>Jam Masuk</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {jadwalList.map((jadwal, index) => (
            <tr key={index}>
              <td>{jadwal.hari}</td>
              <td>{jadwal.jam_masuk}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(jadwal.hari)}
                >
                  Hapus
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default JadwalKerja;
