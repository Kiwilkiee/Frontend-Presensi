import React, { useState } from "react";
import axios from "../../api"; // Pastikan path sesuai
import Header from "../../components/Header";

function Pengajuan() {
  // State untuk menyimpan data form
  const [tanggal, setTanggal] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [gambar, setGambar] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Handle pengiriman form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user_id", 1); 
    formData.append("tanggal_izin", tanggal);
    formData.append("status", keterangan);
    formData.append("deskripsi", deskripsi);
    if (gambar) {
      formData.append("gambar", gambar);
    }

    try {
      const response = await axios.post("/pengajuan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage({ type: "success", text: "Pengajuan berhasil dikirim!" });
      setTanggal("");
      setKeterangan("");
      setDeskripsi("");
      setGambar(null);
    } catch (error) {
      setMessage({ type: "danger", text: "Pengajuan gagal. Coba lagi!" });
    }
  };

  return (
    <>
      <div className="container">
        <div className="mb-5">
          <Header title="Pengajuan" />
        </div>

        <div className="background-container">

          {message.text && (
            <div className={`alert alert-${message.type}`}>{message.text}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="tanggal" className="form-label">
                Tanggal Izin
              </label>
              <input
                type="date"
                className="form-control"
                id="tanggal"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="keterangan">Keterangan</label>
              <select
                className="form-control"
                id="keterangan"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                required
              >
                <option value="" disabled>
                  Pilih Keterangan
                </option>
                <option value="sakit">Sakit</option>
                <option value="cuti">Cuti</option>
                <option value="izin">Izin</option>
              </select>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="deskripsi" className="form-label">
                Deskripsi
              </label>
              <input
                type="text"
                className="form-control"
                id="deskripsi"
                placeholder="Deskripsi singkat"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-2">
              <label htmlFor="gambar">Upload Bukti (Opsional)</label>
              <input
                type="file"
                className="form-control-file"
                id="gambar"
                accept="image/*"
                onChange={(e) => setGambar(e.target.files[0])}
              />
              <small className="form-text text-muted">
                Maksimal ukuran file: 10MB.
              </small>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Kirim Pengajuan
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Pengajuan;
