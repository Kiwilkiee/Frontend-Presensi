import React from 'react';
import { FaBars, FaSignOutAlt, FaBell } from 'react-icons/fa'; 
import Swal from 'sweetalert2'; 
import axios from '../api'; 
import '../style/css/Navbar.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const NavbarComponent = ({ toggleSidebar }) => {

    const navigate = useNavigate();

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
                Cookies.remove('token');
                Cookies.remove('user');
                localStorage.removeItem('user');
                localStorage.removeItem('token');
    
                Swal.fire({
                    title: 'Berhasil Logout',
                    text: 'Anda berhasil keluar dari aplikasi.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    navigate('/login');
                });
            }
        });
    };

    

    return (
        <nav className="navbar">
            <button className="toggle-button" onClick={toggleSidebar}>
                <FaBars /> 
            </button>
            <div className="navbar-icons">
                <button className="notification-button">
                    <FaBell /> 
                </button>
                <button className="logout-button" onClick={handleLogout}>
                    <FaSignOutAlt />
                </button>
            </div>
        </nav>
    );
};

export default NavbarComponent;
