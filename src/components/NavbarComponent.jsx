import React from 'react';
import { FaBars, FaSignOutAlt, FaBell } from 'react-icons/fa'; // Import ikon lonceng
import Swal from 'sweetalert2'; // Import SweetAlert2
import axios from '../api'; // Import axios untuk HTTP requests
import '../style/css/Navbar.css';

const NavbarComponent = ({ toggleSidebar }) => {
    const handleLogout = () => {
        Swal.fire({
            title: 'Apakah yakin ingin keluar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, keluar',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                // Lakukan request logout ke backend
                axios.post('/api/logout')
                    .then(response => {
                        console.log(response.data.message);
                        // Arahkan pengguna ke halaman login setelah logout berhasil
                        window.location.href = '/';
                        Swal.fire({
                            title: 'Berhasil Logout',
                            text: 'Anda berhasil keluar dari aplikasi.',
                            icon: 'success'
                        });
                    })
                    .catch(error => {
                        console.error('There was an error logging out:', error);
                        Swal.fire({
                            title: 'Gagal Logout',
                            text: 'Terjadi kesalahan saat mencoba logout. Coba lagi nanti.',
                            icon: 'error'
                        });
                    });
            }
        });
    };

    return (
        <nav className="navbar">
            <button className="toggle-button" onClick={toggleSidebar}>
                <FaBars /> {/* Ikon toggle */}
            </button>
            <div className="navbar-icons">
                <button className="notification-button">
                    <FaBell /> {/* Ikon lonceng */}
                </button>
                <button className="logout-button" onClick={handleLogout}>
                    <FaSignOutAlt /> {/* Ikon logout */}
                </button>
            </div>
        </nav>
    );
};

export default NavbarComponent;
