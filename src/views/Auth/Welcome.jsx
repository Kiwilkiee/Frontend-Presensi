import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/welcome.css"; // Import file CSS

const Welcome= () => {

  document.title = "Welcome - Absensi Indogreen";

  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="container-welcome">
      <h1 className="title">Selamat Datang di Aplikasi Kami!</h1>
      <p className="subtitle">Jelajahi fitur-fitur terbaik kami dengan mudah.</p>
      <img
        src="src/assets/img/welcome1.png"
        alt="Welcome Illustration"
        className="image"
      />
      <button className="button" onClick={goToLogin}>
        Masuk ke Halaman Login
      </button>
    </div>
  );
};

export default Welcome;
