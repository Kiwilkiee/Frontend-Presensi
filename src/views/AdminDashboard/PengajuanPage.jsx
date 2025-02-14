import React, { useEffect, useState } from "react";
import axios from "../../api"; 
import AdminLayout from "../../layouts/Admin";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function PengajuanAdminPage() {

  document.title = "Pengajuan - Absensi Indogreen";

  const [pengajuan, setPengajuan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPengajuan();
  }, []);

  // Fetch daftar pengajuan dari API
  const fetchPengajuan = async () => {
    try {
      const response = await axios.get("/pengajuan");
      setPengajuan(response.data);
    } catch (error) {
      console.error("Error fetching pengajuan:", error);
    } finally {
      setLoading(false);
    }
  };

 
  const fetchDetailPengajuan = async (id) => {
    try {
      const response = await axios.get(`/pengajuan/${id}`);
      const data = response.data;

      Swal.fire({
        title: "Detail Pengajuan",
        html: `
          <p><strong>Nama:</strong> ${data.user?.nama || "Tidak Ada Nama"}</p>
          <p><strong>Tanggal Izin:</strong> ${data.tanggal_izin || "Tidak Ada Tanggal"}</p>
          <p><strong>Status:</strong> ${getStatusBadge(data.status)}</p>
          <p><strong>Deskripsi:</strong> ${data.deskripsi || "Tidak Ada Deskripsi"}</p>
          ${data.gambar ? `<img src="/storage/${data.gambar}" alt="Bukti" class="img-fluid mt-2" style="max-width:100%;" />` : ""}
        `,
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: "Terima",
        denyButtonText: "Tolak",
        cancelButtonText: "Tutup",
        confirmButtonColor: "#28a745",
        denyButtonColor: "#dc3545",
      }).then((result) => {
        if (result.isConfirmed) {
          handleUpdateStatus(id, "Disetujui");
        } else if (result.isDenied) {
          handleUpdateStatus(id, "Ditolak");
        }
      });
    } catch (error) {
      console.error("Error fetching detail pengajuan:", error);
    }
  };

  // Update status pengajuan
  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`/pengajuan/${id}/status`, { status });
      Swal.fire("Berhasil!", `Pengajuan telah ${status.toLowerCase()}.`, "success");
      fetchPengajuan(); 
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat memperbarui status.", "error");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Disetujui":
        return `<span class="badge bg-success">Disetujui</span>`;
      case "Ditolak":
        return `<span class="badge bg-danger">Ditolak</span>`;
        case "Expired":
          return `<span class="badge bg-secondary">Expired</span>`;  // Tambahkan expired
        default:
        return `<span class="badge bg-warning text-dark">Belum Diproses</span>`;
    }
  };

  return (
      <div className="container p-4 mas-5" style={{ marginLeft: "200px", maxWidth: "1050px" }}>
        <h4 className="mb-3">Daftar Pengajuan</h4>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-bordered table-sm">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "50px" }}>No</th>
                  <th style={{ width: "150px" }}>Nama</th>
                  <th style={{ width: "120px" }}>Tanggal Izin</th>
                  <th style={{ width: "100px" }}>Status</th>
                  <th style={{ width: "100px" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pengajuan.length > 0 ? (
                  pengajuan.map((item, index) => (
                    <tr key={item.id}>
                      <td className="text-center">{index + 1}</td>
                      <td>{item?.user?.nama|| "Tidak Ada Nama"}</td>
                      <td>{item?.tanggal_izin || "Tidak Ada Tanggal"}</td>
                      <td dangerouslySetInnerHTML={{ __html: getStatusBadge(item?.status) }} />
                      <td className="text-center">
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => fetchDetailPengajuan(item.id)}
                        >
                          <i className="bi bi-eye"></i> Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      Tidak ada pengajuan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
  );
}

export default PengajuanAdminPage;
