// AdminLayout.jsx
import React, { useState } from 'react';
import SidebarComponent from '../components/SidebarComponent';
import NavbarComponent from '../components/NavbarComponent';
import '../style/css/AdminLayout.css'; // Tambahkan CSS jika diperlukan

const Admin = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="admin-layout">
            <SidebarComponent isOpen={isSidebarOpen} />
            <div className={`content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <NavbarComponent toggleSidebar={toggleSidebar} />
                <main>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Admin;
