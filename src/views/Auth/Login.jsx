import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import axios from '../../api';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
    document.title = "Login - Absensi Indogreen";

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (password.length < 5) {
            toast.error('Password harus minimal 5 karakter!');
            return;
        }

        try {
            const response = await axios.post('/login', { email, password });

            if (response.status === 200 && response.data.user) {
                const user = response.data.user;
                const roles = user.roles || [];
                const userRole = roles.length > 0 ? roles[0].name : null;

                if (!userRole) {
                    toast.error('Role pengguna tidak ditemukan.');
                    return;
                }

                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('role', userRole);
                localStorage.setItem('token', response.data.token);

                Cookies.set('token', response.data.token, { expires: 7 });
                Cookies.set('user', JSON.stringify(user), { expires: 7 });

                toast.success('Login Berhasil!');

                if (userRole === 'admin') {
                    navigate('/dashboard');
                } else if (userRole === 'karyawan') {
                    navigate('/home');
                } else {
                    toast.error('Role tidak dikenali!');
                }
            } else {
                toast.error('Data user tidak lengkap!');
            }
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error('Email atau password salah!');
            } else if (error.response?.status === 422) {
                toast.error('Validasi gagal!');
            } else {
                toast.error(`Error: ${JSON.stringify(error.response?.data || error.message)}`);
            }
        }
    };

    useEffect(() => {
        const token = Cookies.get('token');
        const userCookie = Cookies.get('user');

        if (token && userCookie) {
            try {
                const user = JSON.parse(userCookie);
                const role = user?.roles?.[0]?.name || localStorage.getItem('role');

                if (role === 'admin') {
                    navigate('/dashboard');
                } else {
                    navigate('/home');
                }
            } catch (err) {
                console.error('Error parsing user cookie:', err);
                Cookies.remove('token');
                Cookies.remove('user');
            }
        }
    }, [navigate]);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="p-4 w-100" style={{ maxWidth: '400px' }}>
                <div className="text-center mb-4">
                    <h3 className="fw-bold">Hello Again!</h3>
                    <p className="text-muted small">MAsukan Email dan Password</p>
                </div>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-control rounded-pill bg-light border-0 px-4"
                            placeholder="xyz@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-1 position-relative">
                        <label className="form-label">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control rounded-pill bg-light border-0 px-4"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                top: '73%',
                                right: '20px',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                fontSize: '18px',
                                color: '#555'
                            }}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </div>
                    </div>
                    <div className="text-end mb-3">
                        <button
                            type="button"
                            className="btn btn-link text-decoration-none p-0 text-muted small"
                            onClick={() => navigate('/forgotPassword')}
                        >
                            Recovery Password
                        </button>
                    </div>
                    <div className="d-grid mb-3">
                        <button className="btn btn-primary rounded-pill fw-semibold py-2" type="submit">
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
