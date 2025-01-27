import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUsers, faClock, faClipboard, faFileAlt } from '@fortawesome/free-solid-svg-icons'; // Import ikon untuk Pengajuan
import AbsenImage from '../assets/img/absenn.png';
import '../style/css/Sidebar.css';

const SidebarComponent = ({ isOpen }) => {
    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="profile-section">
                <img src={AbsenImage} alt="absen-img" />
            </div>
            <h1>SI'ABSENSI</h1>
            <ul>
                <li>
                    <NavLink
                        to="/Dashboard"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                    >
                        <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/Karyawan"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                    >
                        <FontAwesomeIcon icon={faUsers} /> Karyawan
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/absensi"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                    >
                        <FontAwesomeIcon icon={faClock} /> Absensi
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/rekap"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                    >
                        <FontAwesomeIcon icon={faClipboard} /> Rekap
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/pengajuan"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                    >
                        <FontAwesomeIcon icon={faFileAlt} /> Pengajuan {/* Menu Pengajuan */}
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default SidebarComponent;
