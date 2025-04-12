import React, { useEffect, useState } from "react";
import axios from "../../api";
import Header from "../../components/Header";
import Modal from "react-modal";
import "../../style/css/Pengajuan.css";

Modal.setAppElement("#root"); // penting agar modal bisa diakses dengan benar

function Pengajuan() {
  const [pengajuanList, setPengajuanList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    tanggal_izin: "",
    keterangan: "",
    deskripsi: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 50 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 50MB!");
      e.target.value = null;
      return;
    }
    setSelectedFile(file);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("tanggal_izin", form.tanggal_izin);
      formData.append("keterangan", form.keterangan);
      formData.append("deskripsi", form.deskripsi);
      if (selectedFile) {
        formData.append("gambar", selectedFile);
      }

      await axios.post("/pengajuan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setIsModalOpen(false);
      setForm({ tanggal_izin: "", keterangan: "", deskripsi: "" });
      setSelectedFile(null);
      fetchPengajuan();
    } catch (err) {
      console.error("Gagal menambah pengajuan:", err);
    }
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
              style={{ borderColor: "#ccc" }}
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
              <p className="mb-1">{item.deskripsi}</p>

              {item.gambar && (
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/storage/${item.gambar}`}
                  alt="Bukti"
                  className="img-fluid rounded"
                  style={{ maxWidth: "200px", marginTop: "10px" }}
                />
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Tambah Pengajuan"
        style={{
          content: {
            maxWidth: "500px",
            margin: "auto",
            borderRadius: "10px",
            padding: "20px",
          },
        }}
      >
        <h5 className="mb-3">Tambah Pengajuan</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Tanggal Izin</label>
            <input
              type="date"
              name="tanggal_izin"
              className="form-control"
              value={form.tanggal_izin}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Keterangan</label>
            <select
              name="keterangan"
              className="form-control"
              value={form.keterangan}
              onChange={handleChange}
              required
            >
              <option value="">Pilih</option>
              <option value="Sakit">Sakit</option>
              <option value="Cuti">Cuti</option>
              <option value="Izin">Izin</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Deskripsi</label>
            <textarea
              name="deskripsi"
              className="form-control"
              rows="3"
              value={form.deskripsi}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Upload Gambar (Opsional, maks 50MB)</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleFileChange}
            />
          </div>

          {selectedFile && (
            <div className="mb-3">
              <strong>Preview Gambar:</strong><br />
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="img-fluid rounded mt-2"
                style={{ maxHeight: "200px" }}
              />
            </div>
          )}

          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Pengajuan;
