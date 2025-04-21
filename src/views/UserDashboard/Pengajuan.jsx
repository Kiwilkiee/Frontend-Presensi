import React, { useEffect, useState } from "react";
import axios from "../../api";
import Header from "../../components/Header";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Modal from "react-modal";
import "../../style/css/Pengajuan.css";

Modal.setAppElement('#root');
const MySwal = withReactContent(Swal);

function Pengajuan() {
  const [pengajuanList, setPengajuanList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [form, setForm] = useState({
    nama: "",
    tanggal_izin: "",
    tanggal_selesai: "",
    keterangan: "",
    deskripsi: "",
    alasan: "",
  });

  useEffect(() => {
    fetchPengajuan();
  }, []);

  const fetchPengajuan = async () => {
    const userId = JSON.parse(localStorage.getItem("user"))?.id;
    try {
      const res = await axios.get(`/pengajuan/user/${userId}`);
      const sortedData = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      setPengajuanList(sortedData);
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
      formData.append("tanggal_selesai", form.tanggal_selesai);
      formData.append("keterangan", form.keterangan);
      formData.append("deskripsi", form.deskripsi);
      if (selectedFile) {
        formData.append("gambar", selectedFile);
      }

      await axios.post("/pengajuan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsModalOpen(false);
      setForm({ tanggal_izin: "", tanggal_selesai: "", keterangan: "", deskripsi: "" });
      setSelectedFile(null);
      fetchPengajuan();
    } catch (err) {
      console.error("Gagal menambah pengajuan:", err);
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

  const showDetailSwal = (pengajuan) => {
    const statusColor = pengajuan.status === "Diterima" ? "green" :
                        pengajuan.status === "Ditolak" ? "red" : "gray";

    MySwal.fire({
      html: `
        <div style="font-size: 15px; text-align: left;">
          <div style="font-size: 20px; font-weight: bold; margin-bottom: 2px;">Detail Pengajuan</div>
          <hr style="border: none; height: 2px; background-color: black; margin-bottom: 10px;" />

          <div style="display: flex; gap: 2px; margin-bottom: 15px;">
            <button class="tab-btn active-tab" id="dataBtn">Data</button>
            <button class="tab-btn" id="fotoBtn">Foto</button>
          </div>

          <div id="dataTab" class="tab-content">
            <div style="margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #000;">
              <div><strong>Tanggal Izin</strong></div>
              <div>
                ${new Date(pengajuan.tanggal_izin).toLocaleDateString("id-ID")}
                s.d.
                ${new Date(pengajuan.tanggal_selesai || pengajuan.tanggal_izin).toLocaleDateString("id-ID")}
              </div>
            </div>
            <div style="margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #000;">
              <div><strong>Keterangan</strong></div>
              <div>${pengajuan.keterangan}</div>
            </div>
            <div style="margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #000;">
              <div><strong>Deskripsi</strong></div>
              <div>${pengajuan.deskripsi}</div>
            </div>
            <div style="margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #000;">
              <div><strong>Status</strong></div>
              <span style="color: white; background: ${statusColor}; padding: 4px 12px; border-radius: 10px; font-weight: 600;">${pengajuan.status}</span>
            </div>
            <div style="margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #000;">
              <div><strong>Pesan dari Admin</strong></div>
              <div>${pengajuan.alasan || 'Tidak ada pesan.'}</div>
            </div>
          </div>

          <div class="tab-content" id="fotoTab" style="display: none; text-align: center;">
            ${pengajuan.gambar
              ? `<img src="http://localhost:8000/storage/${pengajuan.gambar}" alt="Foto" style="max-width: 100%; border-radius: 10px;" />`
              : 'Foto tidak tersedia.'
            }
          </div>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      width: 600,
      customClass: { popup: 'rounded-4 p-3 swal-detail-modal' },
      didOpen: () => {
        const dataBtn = document.getElementById("dataBtn");
        const fotoBtn = document.getElementById("fotoBtn");
        const dataTab = document.getElementById("dataTab");
        const fotoTab = document.getElementById("fotoTab");

        dataBtn.addEventListener("click", () => {
          dataTab.style.display = "block";
          fotoTab.style.display = "none";
          dataBtn.classList.add("active-tab");
          fotoBtn.classList.remove("active-tab");
        });

        fotoBtn.addEventListener("click", () => {
          dataTab.style.display = "none";
          fotoTab.style.display = "block";
          fotoBtn.classList.add("active-tab");
          dataBtn.classList.remove("active-tab");
        });
      }
    });
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
              onClick={() => showDetailSwal(item)}
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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "30px",
            borderRadius: "10px",
            width: "90%",
            maxWidth: "500px",
          },
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        }}
      >
        <h5 className="mb-3">Tambah Pengajuan</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="form-label">Tanggal Izin</label>
            <input type="date" className="form-control" name="tanggal_izin" value={form.tanggal_izin} onChange={handleFormChange} required />
          </div>
          <div className="mb-2">
            <label className="form-label">Tanggal Selesai</label>
            <input type="date" className="form-control" name="tanggal_selesai" value={form.tanggal_selesai} onChange={handleFormChange} required />
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
            <input type="file" accept="image/*" className="form-control" onChange={handleFileChange} />
          </div>
          <div className="d-flex justify-content-end">
            <button className="btn btn-secondary me-2" onClick={() => setIsModalOpen(false)} type="button">Batal</button>
            <button className="btn btn-primary" type="submit">Simpan</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Pengajuan;
