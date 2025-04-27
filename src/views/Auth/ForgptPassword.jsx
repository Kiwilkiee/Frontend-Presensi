import React, { useState } from 'react';
import axios from '../../api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { IoArrowBack } from 'react-icons/io5';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/forgot-password', { email });

            // Menampilkan modal seperti gambar
            Swal.fire({
                iconHtml: '<img src="https://cdn-icons-png.flaticon.com/512/561/561127.png" width="40" />',
                title: '<strong>Check Your Email</strong>',
                html: 'We have send password recovery code in your email',
                showConfirmButton: false,
                timer: 2500,
                customClass: {
                    popup: 'rounded-3xl px-4 py-6',
                    title: 'text-lg',
                    htmlContainer: 'text-sm',
                }
            });

            setTimeout(() => {
                navigate('/verifyOtp', { state: { email } });
            }, 2600);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal mengirim OTP',
                text: 'Pastikan email benar dan terdaftar.',
                timer: 2000,
                showConfirmButton: false
            });
        }
    };

    return (
        <div className="min-h-screen d-flex flex-column justify-content-center align-items-center px-4 bg-white">
            <div className="w-100" style={{ maxWidth: '400px' }}>
                <button onClick={() => navigate(-1)} className="btn btn-link p-0 mb-3">
                    <IoArrowBack size={24} />
                </button>
                <h3 className="fw-bold text-center">Forgot Password</h3>
                <p className="text-center text-muted small mb-4">Enter your email account to reset your password</p>

                <form onSubmit={handleSendOtp}>
                    <div className="mb-4">
                        <input
                            type="email"
                            className="form-control rounded-4 py-3 px-4 border-0 shadow-sm"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 rounded-pill py-3 fw-semibold">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
