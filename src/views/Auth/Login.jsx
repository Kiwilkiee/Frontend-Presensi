import React, { useState, useEffect } from 'react';
import { AiOutlineLogin } from 'react-icons/ai';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import axios from '../../api'; 

const Login = () => {
    
    document.title = "Login - Absensi Indogreen";

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
    
        // ✅ Cek panjang password sebelum mengirim request
        if (password.length < 5) {
            toast.error('Password harus minimal 5 karakter!', {
                position: "top-right",
                duration: 4000,
            });
            return; // Mencegah request dikirim ke server
        }
    
        try {
            const response = await axios.post('/login', { 
                email: email,
                password: password 
            });
    
            if (response.status === 200) {
                const userRole = response.data.user.roles[0].name;
    
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('role', userRole);
                localStorage.setItem('token', response.data.token);
    
                Cookies.set('token', response.data.token, { expires: 7 });
                Cookies.set('user', JSON.stringify(response.data.user), { expires: 7 });
    
                toast.success('Login Berhasil!', {
                    position: "top-right",
                    duration: 4000,
                });
    
                if (userRole === 'admin') {
                    navigate('/dashboard'); 
                } else if (userRole === 'karyawan') {
                    navigate('/home');
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error('Email atau password salah!', {
                    position: "top-right",
                    duration: 4000,
                });
            } else if (error.response && error.response.status === 422) {
                toast.error('Password terlalu pendek!', {
                    position: "top-right",
                    duration: 4000,
                });
            } else {
                toast.error('Terjadi kesalahan sistem. Coba lagi nanti.', {
                    position: "top-right",
                    duration: 4000,
                });
            }
        }
    };
    

    useEffect(() => {
        // Jika token ada, redirect ke halaman home
        const token = Cookies.get('token');
        if (token) {
            const user = JSON.parse(Cookies.get('user'));
            if (user.role === 'admin') {
                navigate('/dashboard');
            } else {
                navigate('/home');
            }
        }
    }, [navigate]);

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="text-center mb-4">
                    <AiOutlineLogin style={{ fontSize: '50px' }} />
                </div>
                <div className="text-login text-center mb-4">
                    <h3>Login</h3>
                    <p>Silahkan masukkan email dan password Anda</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            placeholder="Masukkan Email"
                            required
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            placeholder="Masukkan Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
