import React, { useEffect, useState } from "react";
import axios from "../../api";
import Header from "../../components/Header";
import Modal from "react-modal";
import "../../style/css/Pengajuan.css";

Modal.setAppElement('#root');

function Pengajuan() {
  const [pengajuanList, setPengajuanList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPengajuan, setSelectedPengajuan] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [form, setForm] = useState({
    tanggal_izin: "",
    keterangan: "",
    deskripsi: "",
  });

  useEffect(() => {
    fetchPengajuan();
  }, []);

  const fetchPengajuan = async () => {
    const userId = JSON.parse(localStorage.getItem("user"))?.id;
    try {
      const res = await axios.get(`/pengajuan/user/${userId}`);
      setPengajuanList(res.data);
    } catch (err) {
      console.error("Gagal mengambil data pengajuan:", err);
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 10MB!");
      e.target.value = null;
      return;
    }
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = JSON.parse(localStorage.getItem("user"))?.id;
  
    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("tanggal_izin", form.tanggal_izin);
      formData.append("keterangan", form.keterangan);
      formData.append("deskripsi", form.deskripsi);
      if (selectedFile) {
        formData.append("gambar", selectedFile);
      }
  
      await axios.post("/pengajuan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setIsModalOpen(false);
      setForm({ tanggal_izin: "", keterangan: "", deskripsi: "" });
      setSelectedFile(null);
      fetchPengajuan();
    } catch (err) {
      console.error("Gagal menambah pengajuan:", err);
    }
  };
  

  const openDetailModal = (pengajuan) => {
    setSelectedPengajuan(pengajuan);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedPengajuan(null);
    setIsDetailModalOpen(false);
  };

  const getStatusClass = (status) => {
    if (!status) return "text-dark";
    const s = status.toLowerCase();
    if (s === "diterima") return "text-success fw-bold";
    if (s === "menunggu") return "text-secondary fw-bold";
    if (s === "ditolak") return "text-danger fw-bold";
    return "text-dark";
  };

  const getKeteranganClass = (keterangan) => {
    if (!keterangan) return "text-dark";
    const j = keterangan.toLowerCase();
    if (j === "sakit") return "text-danger fw-bold";
    if (j === "cuti") return "text-warning fw-bold";
    if (j === "izin") return "text-primary fw-bold";
    return "text-dark";
  };

  return (
    <div className="container">
      <Header title="Pengajuan" />
      <div className="container mt-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-semibold">Riwayat Pengajuan</h5>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            + Tambah Pengajuan
          </button>
        </div>
        <hr />

        {pengajuanList.length === 0 ? (
          <p className="text-muted">Belum ada pengajuan.</p>
        ) : (
          pengajuanList.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-4 shadow-sm p-3 mb-3 border-start border-5"
              style={{ borderColor: "#ccc", cursor: "pointer" }}
              onClick={() => openDetailModal(item)}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className={`${getKeteranganClass(item.keterangan)} fs-5`}>
                  {item.keterangan || "keterangan tidak ada"}
                </span>
                <span className="fw-bold fs-5">
                  {new Date(item.tanggal_izin).toLocaleDateString("id-ID")}
                </span>
              </div>

              <div className={`${getStatusClass(item.status)} mb-2`}>
                {item.status || "Status tidak ada"}
              </div>

              <hr className="my-2" />
              <p className="mb-0">{item.deskripsi}</p>
            </div>
          ))
        )}
      </div>

      {/* Modal Tambah */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "30px",
            borderRadius: "10px",
            width: "90%", maxWidth: "500px",
          },
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" }
        }}
      >
        <h5 className="mb-3">Tambah Pengajuan</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="form-label">Tanggal Izin</label>
            <input type="date" className="form-control" name="tanggal_izin" value={form.tanggal_izin} onChange={handleFormChange} required />
          </div>
          <div className="mb-2">
            <label className="form-label">Keterangan</label>
            <select className="form-select" name="keterangan" value={form.keterangan} onChange={handleFormChange} required>
              <option value="">-- Pilih --</option>
              <option value="Sakit">Sakit</option>
              <option value="Cuti">Cuti</option>
              <option value="Izin">Izin</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Deskripsi</label>
            <textarea className="form-control" name="deskripsi" rows="3" value={form.deskripsi} onChange={handleFormChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Upload Gambar (Opsional, maks 10MB)</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleFileChange}
            />
          </div>
          <div className="d-flex justify-content-end">
            <button className="btn btn-secondary me-2" onClick={() => setIsModalOpen(false)} type="button">Batal</button>
            <button className="btn btn-primary" type="submit">Simpan</button>
          </div>
        </form>
      </Modal>

      {/* Modal Detail Pengajuan */}
      <Modal
        isOpen={isDetailModalOpen}
        onRequestClose={closeDetailModal}
        style={{
          content: {
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "30px",
            borderRadius: "10px",
            width: "90%", maxWidth: "500px",
          },
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" }
        }}
      >
        {selectedPengajuan && (
          <>
            <h5 className="mb-3">Detail Pengajuan</h5>
            <p><strong>Tanggal izin:</strong> {new Date(selectedPengajuan.tanggal_izin).toLocaleDateString("id-ID")}</p>
            <p><strong>Keterangan:</strong> {selectedPengajuan.keterangan}</p>
            <p><strong>Deskripsi:</strong> {selectedPengajuan.deskripsi}</p>
            <p><strong>Status:</strong> {selectedPengajuan.status}</p>
            {selectedPengajuan.gambar && (
              <div className="mb-3">
                <strong>Foto:</strong>
                <br />
                <img
                  src={`http://localhost:8000/storage/${selectedPengajuan.gambar}`}
                  alt="Foto Pengajuan"
                  className="img-fluid rounded mt-2"
                />
              </div>
            )}
            <div className="text-end">
              <button className="btn btn-secondary" onClick={closeDetailModal}>Tutup</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

export default Pengajuan;
