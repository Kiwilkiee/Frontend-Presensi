import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faUsers,
  faClock,
  faClipboard,
  faFileAlt,
  faBriefcase,
  faCog,
  faChevronDown,
  faMapMarkerAlt,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import '../style/css/Sidebar.css';

const SidebarComponent = ({ collapsed }) => {
  const [settingOpen, setSettingOpen] = useState(false);

  const toggleSetting = () => {
    setSettingOpen(!settingOpen);
  };

  return (
    <div className={`custom-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <FontAwesomeIcon icon={faBriefcase} className="logo-icon" />
          {!collapsed && <span className="logo-text">KaryaOne</span>}
        </div>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/Dashboard" className="nav-item">
          <FontAwesomeIcon icon={faTachometerAlt} className="icon" />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>
        <NavLink to="/Karyawan" className="nav-item">
          <FontAwesomeIcon icon={faUsers} className="icon" />
          {!collapsed && <span>Karyawan</span>}
        </NavLink>
        <NavLink to="/absensi" className="nav-item">
          <FontAwesomeIcon icon={faClock} className="icon" />
          {!collapsed && <span>Absensi</span>}
        </NavLink>
        <NavLink to="/rekap" className="nav-item">
          <FontAwesomeIcon icon={faClipboard} className="icon" />
          {!collapsed && <span>Rekap</span>}
        </NavLink>
        <NavLink to="/pengajuan-adm" className="nav-item">
          <FontAwesomeIcon icon={faFileAlt} className="icon" />
          {!collapsed && <span>Pengajuan</span>}
        </NavLink>

        {/* 🔧 Setting Menu */}
        <div className="nav-item setting-toggle" onClick={toggleSetting}>
          <FontAwesomeIcon icon={faCog} className="icon" />
          {!collapsed && (
            <>
              <span>Setting</span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`chevron ${settingOpen ? 'rotate' : ''}`}
              />
            </>
          )}
        </div>
        {!collapsed && settingOpen && (
          <div className="submenu">
            <NavLink to="/setting/lokasi" className="nav-item sub-item">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
              <span>Lokasi</span>
            </NavLink>
            <NavLink to="/setting/jadwal" className="nav-item sub-item">
              <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
              <span>Jadwal Kerja</span>
            </NavLink>
            <NavLink to="/setting/Pengingat" className="nav-item sub-item">
              <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
              <span>Pengingat Absensi</span>
            </NavLink>
          </div>
        )}
      </nav>
    </div>
  );
};

export default SidebarComponent;
