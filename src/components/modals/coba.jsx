import React, { useState } from 'react';
import axios from '../../api';
import { Modal, Button, Form } from 'react-bootstrap';


function TambahKaryawan({ show, handleClose }) {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/user', { nama, email, jabatan, role, password })
      .then((response) => {
        handleClose();
        alert('Karyawan berhasil ditambahkan');
      }).catch((error) => {
        console.log('error:', error.response.data);
        alert(error.response.data.message);
      });
  };

  return (
    <Modal show={show} onHide={() => handleClose(null)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Tambah Karyawan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formNama">
            <Form.Label>Nama</Form.Label>
            <Form.Control
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              placeholder="Masukkan nama karyawan"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Masukkan email karyawan"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formJabatan">
            <Form.Label>Jabatan</Form.Label>
            <Form.Control
              type="text"
              value={jabatan}
              onChange={(e) => setJabatan(e.target.value)}
              required
              placeholder="Masukkan jabatan"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formRole">
            <Form.Label>Role</Form.Label>
            <Form.Control
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              placeholder="Masukkan role"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Masukkan password"
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Tambah
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default TambahKaryawan;
