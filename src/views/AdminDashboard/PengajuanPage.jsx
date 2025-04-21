import React, { useEffect, useState } from "react";
import axios from "../../api";
import AdminLayout from "../../layouts/Admin";
import Swal from "sweetalert2";
import { Table, Button, Form } from "react-bootstrap";
import "../../style/css/Karyawan.css";

function PengajuanAdminPage() {
  document.title = "Pengajuan - Absensi Indogreen";

  const [pengajuan, setPengajuan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  useEffect(() => {
    fetchPengajuan();
  }, []);

  const fetchPengajuan = async () => {
    try {
      const response = await axios.get("/pengajuan");
      const sortedData = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setPengajuan(sortedData);
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
      let currentTab = "data";

      const renderContent = () => {
        if (currentTab === "foto") {
          return data.gambar
            ? `<img src="http://localhost:8000/storage/${data.gambar}" alt="Bukti" class="modal-image" style="max-width: 100%; border-radius: 8px;" />`
            : `<p class="text-muted">Tidak ada gambar</p>`;
        } else {
          return `
            <div class="detail-row"><strong>Nama</strong><div class="text-dtl">${data.user?.nama || "-"}</div></div>
            <div class="detail-row">
              <strong>Tanggal Izin</strong>
              <div class="text-dtl">
                ${
                  data.tanggal_izin
                    ? `${new Date(data.tanggal_izin).toLocaleDateString("id-ID")} ${
                        data.tanggal_selesai && data.tanggal_selesai !== data.tanggal_izin
                          ? `s.d. ${new Date(data.tanggal_selesai).toLocaleDateString("id-ID")}`
                          : ""
                      }`
                    : "-"
                }
              </div>
            </div>
            <div class="detail-row"><strong>Keterangan</strong><div class="text-dtl">${data.keterangan || "-"}</div></div>
            <div class="detail-row"><strong>Deskripsi</strong><div class="text-dtl">${data.deskripsi || "-"}</div></div>
            <div class="detail-row"><strong>Status</strong><div class="text-dtl">${getStatusBadge(data.status)}</div></div>
            ${
              data.status === "Ditolak"
                ? `<div class="detail-row"><strong>Pesan dari Admin</strong><div>${data.alasan || "Tidak Ada Pesan"}</div></div>`
                : ""
            }
          `;
        }
      };

      Swal.fire({
        html: `
          <div class="custom-modal">
            <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 10px;">Detail Pengajuan</h2>
            <hr style="margin-bottom: 15px;" />
            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
              <button class="tab-btn active-tab" id="btn-data">Data</button>
              <button class="tab-btn" id="btn-foto">Foto</button>
            </div>
            <div id="modal-content">${renderContent()}</div>
          </div>
        `,
        showCancelButton: true,
        showDenyButton: data.status === "Menunggu",
        showConfirmButton: data.status === "Menunggu",
        cancelButtonText: "Tutup",
        confirmButtonText: "Setujui",
        denyButtonText: "Tolak",
        width: "600px",
        customClass: {
          popup: "custom-modal-popup",
        },
        didOpen: () => {
          document.getElementById("btn-data").addEventListener("click", () => {
            currentTab = "data";
            document.getElementById("btn-foto").classList.remove("active-tab");
            document.getElementById("btn-data").classList.add("active-tab");
            document.getElementById("modal-content").innerHTML = renderContent();
          });
          document.getElementById("btn-foto").addEventListener("click", () => {
            currentTab = "foto";
            document.getElementById("btn-data").classList.remove("active-tab");
            document.getElementById("btn-foto").classList.add("active-tab");
            document.getElementById("modal-content").innerHTML = renderContent();
          });
        },
      }).then((result) => {
        if (data.status !== "Menunggu") return;
        if (result.isConfirmed) {
          handleUpdateStatus(id, "Diterima");
        } else if (result.isDenied) {
          Swal.fire({
            title: "Alasan Penolakan",
            input: "textarea",
            inputLabel: "Tuliskan alasan penolakan",
            inputPlaceholder: "Contoh: Cuti melebihi batas maksimal...",
            inputAttributes: {
              "aria-label": "Alasan penolakan",
            },
            showCancelButton: true,
            confirmButtonText: "Kirim",
            cancelButtonText: "Batal",
            preConfirm: (alasan) => {
              if (!alasan) {
                Swal.showValidationMessage("Alasan penolakan wajib diisi");
              }
              return alasan;
            },
          }).then((alasanResult) => {
            if (alasanResult.isConfirmed) {
              handleUpdateStatus(id, "Ditolak", alasanResult.value);
            }
          });
        }
      });
    } catch (error) {
      console.error("Error fetching detail pengajuan:", error);
    }
  };

  const handleUpdateStatus = async (id, status, alasan = "") => {
    try {
      await axios.put(`/pengajuan/${id}/status`, {
        status,
        alasan,
      });
      fetchPengajuan(); // refresh data
      Swal.fire("Sukses", `Status berhasil diperbarui menjadi ${status}`, "success");
    } catch (error) {
      console.error("Gagal update status:", error);
      Swal.fire("Error", "Gagal mengubah status", "error");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Diterima":
        return `<span class="badge bg-success">Disetujui</span>`;
      case "Ditolak":
        return `<span class="badge bg-danger">Ditolak</span>`;
      case "Expired":
        return `<span class="badge bg-secondary">Expired</span>`;
      default:
        return `<span class="badge bg-warning text-dark">Belum Diproses</span>`;
    }
  };

  const filteredPengajuan = pengajuan.filter((item) =>
    item?.user?.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPengajuan.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPengajuan.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="karyawan-page">
      <div className="header-karyawan">
        <h1>Daftar Pengajuan</h1>
        <div className="controls">
          <Form.Control 
            type="text"
            placeholder="Cari berdasarkan nama..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <Table striped bordered hover responsive className="karyawan-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Tanggal Izin</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={item.id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{item?.user?.nama || "Tidak Ada Nama"}</td>
                  <td>
                    {item?.tanggal_izin
                      ? `${new Date(item.tanggal_izin).toLocaleDateString("id-ID")} ${
                          item.tanggal_selesai && item.tanggal_selesai !== item.tanggal_izin
                            ? `s.d. ${new Date(item.tanggal_selesai).toLocaleDateString("id-ID")}`
                            : ""
                        }`
                      : "Tidak Ada Tanggal"}
                  </td>
                  <td dangerouslySetInnerHTML={{ __html: getStatusBadge(item.status) }} />
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => fetchDetailPengajuan(item.id)}
                    >
                      Detail
                    </Button>
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
        </Table>
      )}

      <div className="pagination-container mt-3 d-flex justify-content-center flex-wrap gap-2">
                  <Button
                    variant="outline-primary"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  >
                    First
                  </Button>
      
                  <Button
                    variant="outline-primary"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                     &lt;
                  </Button>
      
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((number) => {
                      // Tampilkan hanya sekitar currentPage +/- 2
                      return (
                        number === 1 ||
                        number === totalPages ||
                        (number >= currentPage - 2 && number <= currentPage + 2)
                      );
                    })
                    .map((number, i, arr) => {
                      const prev = arr[i - 1];
                      const showEllipsis = prev && number - prev > 1;
      
                      return (
                        <React.Fragment key={number}>
                          {showEllipsis && <span className="mx-2">...</span>}
                          <Button
                            variant={number === currentPage ? "primary" : "outline-primary"}
                            onClick={() => handlePageChange(number)}
                          >
                            {number}
                          </Button>
                        </React.Fragment>
                      );
                    })}
      
                  <Button
                    variant="outline-primary"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                      &gt;
                  </Button>
      
                  <Button
                    variant="outline-primary"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    Last
                  </Button>
                </div>
    </div>
  );
}

export default PengajuanAdminPage;
