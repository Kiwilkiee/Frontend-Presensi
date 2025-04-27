import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../api';
import Swal from 'sweetalert2';
import { IoArrowBack } from 'react-icons/io5';

const VerifyOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || '';

    const [otp, setOtp] = useState(new Array(6).fill(''));
    const inputRefs = useRef([]);

    // Timer resend (optional visual)
    const [secondsLeft, setSecondsLeft] = useState(30);

    useEffect(() => {
        const timer = setInterval(() => {
            setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleChange = (element, index) => {
        const value = element.value.replace(/[^0-9]/g, '');
        if (!value) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Pindah ke input berikutnya
        if (index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleBackspace = (e, index) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalOtp = otp.join('');

        try {
            await axios.post('/verify-otp', {
                email,
                otp: finalOtp,
            });

            Swal.fire({
                icon: 'success',
                title: 'OTP Benar!',
                text: 'Silakan lanjut reset password.',
                timer: 2000,
                showConfirmButton: false,
            });

            setTimeout(() => {
                navigate('/resetPassword', { state: { email, otp: finalOtp } });
            }, 2100);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Kode OTP salah',
                text: 'Cek kembali kode yang dikirim ke email Anda.',
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
                <h4 className="fw-bold text-center">OTP Verification</h4>
                <p className="text-center text-muted small mb-4">
                    Please check your email to see the verification code
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="d-flex justify-content-between mb-4">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                className="form-control text-center fw-bold rounded-3 shadow-sm mx-1"
                                style={{ width: '45px', height: '55px', fontSize: '24px' }}
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleBackspace(e, index)}
                            />
                        ))}
                    </div>

                    <button type="submit" className="btn btn-primary w-100 rounded-pill py-3 fw-semibold">
                        Verify
                    </button>
                </form>

                <div className="text-muted small mt-3 text-end">
                    Resend code to {secondsLeft < 10 ? `00:0${secondsLeft}` : `00:${secondsLeft}`}
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
