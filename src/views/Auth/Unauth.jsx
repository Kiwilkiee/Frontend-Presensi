import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Cookies from 'js-cookie';

const Unauthorized = () => {
    const navigate = useNavigate();

    const clearDataAndRedirect = () => {
        // Menghapus semua cookies
        const cookies = Cookies.get();
        Object.keys(cookies).forEach(cookie => {
            Cookies.remove(cookie);
        });
        
        // Menghapus semua data dari localStorage
        localStorage.clear();

        // Navigasi ke halaman login
        navigate('/');
    };

    const goBack = () => navigate(-1);

    return (
        <div className="unauthorized-page d-flex justify-content-center align-items-center vh-100">
            <div className="text-center">
                <h1 className="display-4 text-danger mb-4">403</h1>
                <h2 className="mb-4">Unauthorized Access</h2>
                <p className="mb-5">
                    Sorry, you do not have permission to view this page.
                </p>
                <div>
                    <Button variant="primary" className="me-2" onClick={goBack}>
                        Go Back
                    </Button>
                    <Button variant="outline-primary" onClick={clearDataAndRedirect}>
                        Go to Login
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
