import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddModalUser = ({ show, handleClose, handleChange, handleSubmit, karyawan }) => {
  return (
    <Modal
        show={show}
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard={false}
    >

      <Modal.Header closeButton>
        <Modal.Title>Tambah Karyawan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formNama">
            <Form.Label>Nama</Form.Label>
            <Form.Control
              type="text"
              name="nama"
              placeholder="Masukkan nama"
              value={karyawan.nama}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formEmail" className="mt-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Masukkan email"
              value={karyawan.email}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formJabatan" className="mt-3">
            <Form.Label>Jabatan</Form.Label>
            <Form.Control
              type="text"
              name="jabatan"
              placeholder="Masukkan jabatan"
              value={karyawan.jabatan}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Batal
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Simpan
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddModalUser;
