import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Cookies from 'js-cookie';

const Unauthorized = () => {
    document.title = "Unauth - Absensi Indogreen";
    const navigate = useNavigate();
    const location = useLocation();

    const clearDataAndRedirect = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        localStorage.clear();
        navigate('/');
    };

    const goBack = () => {
        const searchParams = new URLSearchParams(location.search);
        const from = searchParams.get('from');

        if (from) {
            navigate(from);
        } else {
            navigate('/home'); // fallback
        }
    };

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
