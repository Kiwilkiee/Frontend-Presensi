import React, { useEffect, useState } from "react";
import axios from "../../api";
import moment from "moment";
import { Table, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaSearch } from "react-icons/fa";
import '../../style/css/Karyawan.css'; // Gunakan styling yang sama

const MySwal = withReactContent(Swal);

function AbsensiPage() {
  document.title = "Absensi - Absensi Indogreen";

  const [absensi, setAbsensi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    fetchAbsensi();
  }, []);

  const fetchAbsensi = async () => {
    try {
      const response = await axios.get("/absensi/today");
      setAbsensi(response.data.data);
    } catch (error) {
      console.error("Error fetching absensi:", error);
    } finally {
      setLoading(false);
    }
  };

  const DetailAbsen = ({ nama, fotoMasuk, fotoPulang, lat, lng }) => {
    let currentTab = 'fotoMasuk';

    const renderContent = () => {
      if (currentTab === 'maps') {
        return `<iframe
          src="https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed"
          width="100%" height="250px" style="border:0;" allowfullscreen=""
        ></iframe>`;
      } else if (currentTab === 'fotoPulang') {
        return `<img src="${fotoPulang}" alt="Foto Pulang" class="modal-image" />`;
      } else {
        return `<img src="${fotoMasuk}" alt="Foto Masuk" class="modal-image" />`;
      }
    };

    MySwal.fire({
      html: `
        <div class="custom-modal">
          <div class="modal-header-custom">
            <h2>${nama}</h2>
            <hr class="modal-divider" />
          </div>
          <div class="modal-tabs">
            <button class="tab-btn active-tab" id="btn-foto-masuk">Foto Masuk</button>
            <button class="tab-btn" id="btn-foto-pulang">Foto Pulang</button>
            <button class="tab-btn" id="btn-maps">Maps</button>
          </div>
          <div id="modal-content">${renderContent()}</div>
        </div>
      `,
      showConfirmButton: false,
      width: '700px',
      customClass: { popup: 'custom-modal-popup' },
      didOpen: () => {
        const masukBtn = document.getElementById('btn-foto-masuk');
        const pulangBtn = document.getElementById('btn-foto-pulang');
        const mapsBtn = document.getElementById('btn-maps');
        const contentEl = document.getElementById('modal-content');

        masukBtn.addEventListener('click', () => {
          currentTab = 'fotoMasuk';
          masukBtn.classList.add('active-tab');
          pulangBtn.classList.remove('active-tab');
          mapsBtn.classList.remove('active-tab');
          contentEl.innerHTML = renderContent();
        });

        pulangBtn.addEventListener('click', () => {
          currentTab = 'fotoPulang';
          pulangBtn.classList.add('active-tab');
          masukBtn.classList.remove('active-tab');
          mapsBtn.classList.remove('active-tab');
          contentEl.innerHTML = renderContent();
        });

        mapsBtn.addEventListener('click', () => {
          currentTab = 'maps';
          mapsBtn.classList.add('active-tab');
          masukBtn.classList.remove('active-tab');
          pulangBtn.classList.remove('active-tab');
          contentEl.innerHTML = renderContent();
        });
      }
    });
  };

  const handleDetail = (item) => {
    DetailAbsen({
      nama: item.user.nama,
      fotoMasuk: `http://localhost:8000/storage/${item.foto_masuk}`,
      fotoPulang: `http://localhost:8000/storage/${item.foto_pulang}`,
      lat: item.latitude,
      lng: item.longitude,
    });
  };

  // Filter dan pagination
  const filteredAbsensi = absensi.filter((item) =>
    item.user.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredAbsensi.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAbsensi = filteredAbsensi.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="karyawan-page">
      <div className="header-karyawan">
        <h1>Absensi Hari Ini</h1>
        <div className="controls">
          <Form.Control
            type="text"
            placeholder="Cari nama..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <Table striped bordered hover className="karyawan-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Tanggal</th>
                <th>Jam Masuk</th>
                <th>Jam Pulang</th>
                <th>Status Kehadiran</th>
                <th>Menit Terlambat</th>
                <th>Status</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {currentAbsensi.length > 0 ? (
                currentAbsensi.map((item, index) => (
                  <tr key={item.id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{item.user.nama}</td>
                    <td>{moment(item.created_at).format("DD-MM-YYYY")}</td>
                    <td>{item.jam_masuk || "-"}</td>
                    <td>{item.jam_pulang || "-"}</td>
                    <td>{item.status_kehadiran || "-"}</td>
                    <td>{item.menit_terlambat || "0"}</td>
                    <td>{item.status || "-"}</td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleDetail(item)}
                      >
                        Detail
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">Tidak ada data</td>
                </tr>
              )}
            </tbody>
          </Table>

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
        </>
      )}
    </div>
  );
}

export default AbsensiPage;
