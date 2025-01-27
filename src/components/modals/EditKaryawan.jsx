import React, { useState, useEffect } from 'react';
import axios from '../../api';
import { Modal, Button, Form } from 'react-bootstrap';
import '../../style/css/modal.css'

function EditKaryawan({ show, handleClose, karyawan }) {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [jabatan, setJabatan] = useState('');

  useEffect(() => {
  if (karyawan) {
    console.log('Editing karyawan:', karyawan); // Tambahkan log ini
    setNama(karyawan.nama);
    setEmail(karyawan.email);
    setJabatan(karyawan.jabatan);
  }
}, [karyawan]);


  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedKaryawan = { nama, email, jabatan };

    axios.put(`/api/user/${karyawan.id}`, updatedKaryawan)
      .then((response) => {
        alert('Karyawan berhasil diperbarui');
        handleClose(updatedKaryawan); // Pass data karyawan yang diperbarui ke parent component
      })
      .catch((error) => {
        console.log('error:', error.response.data);
        alert(error.response.data.message);
      });
  };

  return (
    <Modal className='modal-container' show={show} onHide={() => handleClose(null)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Karyawan</Modal.Title>
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
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formJabatan">
            <Form.Label>Jabatan</Form.Label>
            <Form.Control 
              type="text" 
              value={jabatan} 
              onChange={(e) => setJabatan(e.target.value)} 
              required 
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Simpan
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditKaryawan;
