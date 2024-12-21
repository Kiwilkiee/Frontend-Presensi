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

    const [error, setError] = useState('');


    const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('/login', { 
            email: email,
            password: password 
        });

        const userRole = response.data.user.roles[0].name; // Ambil role dari user

        // Simpan data user dan token
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('role', userRole); // Simpan role
        localStorage.setItem('token', response.data.token);

        // Set cookies
        Cookies.set('token', response.data.token, { expires: 7 });
        Cookies.set('user', JSON.stringify(response.data.user), { expires: 7 });

        toast.success('Login Berhasil', {
            position: "top-right",
            duration: 4000,
        });

        // Arahkan berdasarkan role setelah semua data tersimpan
        if (userRole === 'admin') {
            navigate('/dashboard'); // Admin ke dashboard
        } else if (userRole === 'karyawan') {
            navigate('/home'); // Karyawan ke home
        }

    } catch (error) {
        // Penanganan error
        if (error.response && error.response.data) {
            toast.error('Gagal login. Periksa kembali email dan password Anda.', {
                position: "top-right",
                duration: 4000,
            });
        } else {
            toast.error('Terjadi kesalahan sistem.', {
                position: "top-right",
                duration: 4000,
            });
        }
    }
};


    useEffect(() => {
        // Jika token ada, redirect ke halaman home
        if (Cookies.get('token')) {
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

                {/* Tampilkan pesan kesalahan jika ada */}
                {error && <div className="alert alert-danger">{error}</div>}

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
