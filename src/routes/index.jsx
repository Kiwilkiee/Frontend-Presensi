import React, { lazy, Suspense } from 'react';

//import react router dom
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//import loader component
const Loader = lazy(() => import('../components/Loader.jsx'));

//import view Login
const Login = lazy(() => import('../views/Auth/Login.jsx'));

const Welcome = lazy(() => import('../views/Auth/Welcome.jsx'));

//layouts admin
const AdminLayout = lazy(() => import('../layouts/Admin.jsx'));


//import private routes
import PrivateRoutes from "./privateRoutes.jsx";
import LokasiPage from '../views/AdminDashboard/LokasiPage.jsx';
import AutoRedirect from './AutoRedirect.jsx';


//page user
const Home = lazy(() => import('../views/UserDashboard/Home.jsx'))

const History = lazy(() => import('../views/UserDashboard/History.jsx'))

const Profile = lazy(() => import('../views/UserDashboard/Profile.jsx'))

const Pengajuan = lazy(() => import('../views/UserDashboard/Pengajuan.jsx'))

const Presensi = lazy(() => import('../views/UserDashboard/Presensi.jsx'))

//page admin
const Dashboard = lazy(() => import('../views/AdminDashboard/Dashboad.jsx'))

const Karyawan = lazy(() => import('../views/AdminDashboard/KaryawanPage.jsx'))

const Absensi = lazy(() => import('../views/AdminDashboard/AbsensiPage.jsx'))

const Rekap = lazy(() => import('../views/AdminDashboard/RekapPage.jsx'))

const PengajuanAdmin = lazy(() => import('../views/AdminDashboard/PengajuanPage.jsx'))

const Lokasi = lazy(() => import('../views/AdminDashboard/LokasiPage.jsx'))

const JadwalKerja = lazy(() => import('../views/AdminDashboard/JadwalKerja.jsx'))

const PengingatAbsenPage = lazy(() => import('../views/AdminDashboard/PengingatAbsenPage.jsx'))

const Unauth = lazy(() => import('../views/Auth/Unauth.jsx'))





export default function RoutesIndex() {

    return (
        <Router>
            <Routes>
                <Route 
                path="/"
                element={
                    <Suspense fallback={<Loader />}>
                    <AutoRedirect />
                    </Suspense>
                }
                />


                <Route 
                path="/Login"
                element={
                    <Suspense fallback={<Loader />}>
                        <Login />
                    </Suspense>
                }
                />

                <Route 
                    path="/unauthorized"
                    element={
                        <Suspense fallback={<Loader />}>
                            <Unauth />
                        </Suspense>
                    }
                />

                <Route 
                    path='/home'
                    element={
                        <Suspense fallback={<Loader />}>
                            <PrivateRoutes allowedRoles={['karyawan']}>
                                <Home />
                            </PrivateRoutes>
                        </Suspense>
                    }
                />

                <Route 
                    path='/history'
                    element={
                        <Suspense fallback={<Loader />}>
                            <PrivateRoutes allowedRoles={['karyawan']}>
                                <History />
                            </PrivateRoutes>
                        </Suspense>
                    }
                />

                <Route 
                    path='/profile'
                    element={
                        <Suspense fallback={<Loader />}>
                            <PrivateRoutes allowedRoles={['karyawan']}>
                                <Profile />
                            </PrivateRoutes>
                        </Suspense>
                    }
                />

                <Route 
                    path='/pengajuan'
                    element={
                        <Suspense fallback={<Loader />}>
                            <PrivateRoutes allowedRoles={['karyawan']}>
                                <Pengajuan />
                            </PrivateRoutes>
                        </Suspense>
                    }
                />

                <Route
                    path='/Presensi'
                    element={
                        <Suspense fallback={<Loader />}>
                            <PrivateRoutes allowedRoles={['karyawan']}>
                                <Presensi />
                            </PrivateRoutes>
                        </Suspense>
                    }
                />

                <Route
                    path='/dashboard'
                    element={
                        <Suspense fallback={<Loader />}>
                            <PrivateRoutes allowedRoles={['admin']}>
                                <AdminLayout >
                                    <Dashboard />
                                </AdminLayout>
                            </PrivateRoutes>
                        </Suspense>
                    }
                />

                <Route
                    path='/karyawan'
                    element={
                        <Suspense fallback={<Loader />}>
                            <PrivateRoutes allowedRoles={['admin']}>
                                <AdminLayout >
                                    <Karyawan />
                                </AdminLayout>
                            </PrivateRoutes>
                        </Suspense>
                    }
                />

                <Route
                    path='/Absensi'
                    element={
                        <Suspense fallback={<Loader />}>
                            <PrivateRoutes allowedRoles={['admin']}>
                                <AdminLayout >
                                    <Absensi />
                                </AdminLayout>
                            </PrivateRoutes>
                        </Suspense>
                    }
                />

                <Route
                    path='/Rekap'
                    element={
                        <Suspense fallback={<Loader />}>
                            <PrivateRoutes allowedRoles={['admin']}>
                                <AdminLayout >
                                    <Rekap />
                                </AdminLayout>
                            </PrivateRoutes>
                        </Suspense>
                    }
                />


                <Route 
                    path='/pengajuan-adm'
                    element={
                        <Suspense fallback={<Loader />}>
                            <PrivateRoutes allowedRoles={['admin']}>
                                <AdminLayout>
                                    <PengajuanAdmin />
                                </AdminLayout>
                            </PrivateRoutes>
                        </Suspense>
                    }
                />

                <Route 
                    path='/setting/lokasi'
                    element={
                        <Suspense fallback={<Loader />}>
                            <PrivateRoutes allowedRoles={['admin']}>
                                <AdminLayout>
                                    <LokasiPage />
                                </AdminLayout>
                            </PrivateRoutes>
                        </Suspense>
                    }                    
                />

                <Route 
                    path='/setting/jadwal'
                    element={
                        <Suspense fallback={<Loader />}>
                            <PrivateRoutes allowedRoles={['admin']}>
                                <AdminLayout>
                                    <JadwalKerja />
                                </AdminLayout>
                            </PrivateRoutes>
                        </Suspense>
                    }
                />
                
                <Route 
                    path='/setting/pengingat'
                    element={
                        <Suspense fallback={<Loader />}>
                            <PrivateRoutes allowedRoles={['admin']}>
                                <AdminLayout>
                                    <PengingatAbsenPage />
                                </AdminLayout>
                            </PrivateRoutes>
                        </Suspense>
                    }
                />



            </Routes>
        </Router>

    )
}