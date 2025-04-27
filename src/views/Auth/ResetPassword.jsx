import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../api';
import Swal from 'sweetalert2';
import { IoArrowBack } from 'react-icons/io5';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';
    const otp = location.state?.otp || '';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Password Tidak Cocok',
                text: 'Pastikan password dan konfirmasi sama.',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }

        try {
            await axios.post('/reset-password', {
                email,
                otp,
                password,
                password_confirmation: confirmPassword,
            });

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Password berhasil direset.',
                timer: 2000,
                showConfirmButton: false,
            });

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal Reset Password',
                text: 'Pastikan kode OTP dan email benar.',
                timer: 2000,
                showConfirmButton: false,
            });
        }
    };

    return (
        <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center px-4 bg-white">
            <div className="w-100" style={{ maxWidth: '400px' }}>
                <button onClick={() => navigate(-1)} className="btn btn-link p-0 mb-3">
                    <IoArrowBack size={24} />
                </button>

                <h4 className="fw-bold text-center">Reset Password</h4>
                <p className="text-center text-muted small mb-4">
                    Enter your password and confirm password
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        className="form-control mb-3 rounded-3 shadow-sm px-3 py-3"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                    <input
                        type="password"
                        className="form-control mb-4 rounded-3 shadow-sm px-3 py-3"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="btn btn-primary w-100 rounded-pill py-3 fw-semibold"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
