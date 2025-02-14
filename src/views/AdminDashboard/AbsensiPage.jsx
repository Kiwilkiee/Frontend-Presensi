import React, { useEffect, useState } from "react";
import axios from "../../api";
import moment from "moment"; 

function AbsensiPage() {

  document.title = "Absensi - Absensi Indogreen";

  const [absensi, setAbsensi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAbsensi();
  }, []);

  const fetchAbsensi = async () => {
    try {
      const response = await axios.get("/today"); 
      setAbsensi(response.data.data);
    } catch (error) {
      console.error("Error fetching absensi:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <h4 className="mb-3 text-center">Absensi Hari Ini</h4>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead className="table-dark">
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Tanggal</th>
                <th>Jam Masuk</th>
                <th>Jam Pulang</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {absensi.length > 0 ? (
                absensi.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.nama}</td>
                    <td>{moment(item.created_at).format("DD-MM-YYYY")}</td> 
                    <td>{item.jam_masuk ? moment(item.jam_masuk).format("HH:mm") : "-"}</td>
                    <td>{item.jam_pulang ? moment(item.jam_pulang).format("HH:mm") : "-"}</td>
                    <td>
                      {item.jam_masuk && item.jam_pulang
                        ? "Hadir"
                        : item.jam_masuk && !item.jam_pulang
                        ? "Proses"
                        : "Tidak Hadir"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    Tidak ada data absensi hari ini
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

export default AbsensiPage;
