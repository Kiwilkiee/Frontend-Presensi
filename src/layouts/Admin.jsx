import React, { useState } from 'react';
import SidebarComponent from '../components/SidebarComponent';
import NavbarComponent from '../components/NavbarComponent';
import '../style/css/AdminLayout.css';

const admin = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <SidebarComponent collapsed={collapsed} />
      <div className="main-area">
        <NavbarComponent toggleSidebar={toggleSidebar} />
        <div className="content-area">{children}</div>
      </div>
    </div>
  );
};

export default admin;
