import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineEdit } from "react-icons/md";
import { HiOutlineUser } from "react-icons/hi";
import { IoMailOutline, IoBriefcaseOutline, IoLockClosedOutline } from "react-icons/io5";
import axios from '../../api'; 
import Header from '../../components/Header.jsx';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';



function Profile () {
    const [userData, setUserData] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [currentEditField, setCurrentEditField] = useState('');
    const [editValue, setEditValue] = useState('');
    const navigate = useNavigate();
  
    useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
    
      if (storedUser && storedUser.id) {
        const userId = storedUser.id;
    
        axios.get(`/user/${userId}`)
          .then(response => {
            setUserData(response.data); 
          })
          .catch(error => {
            console.error('Error fetching user data:', error);
          });
      } else {
        console.error('User data not found in localStorage. Please log in again.');
      }
    }, []);
    
  
    const handleEditClick = (field) => {
      setCurrentEditField(field);
      setEditValue(userData[field]);
      setModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setModalOpen(false);
      setCurrentEditField('');
      setEditValue('');
    };
  
    const handleSaveChanges = () => {
      const updatedUserData = { ...userData, [currentEditField]: editValue };
  
      const userId = userData.id; // Gunakan userId dari userData
  
      axios.patch(`/user/${userId}`, updatedUserData)
        .then(response => {
          setUserData(response.data.user); // Update state dengan data baru dari server
          handleCloseModal();
        })
        .catch(error => {
          console.error('Error updating user data:', error);
        });
    };

    const handleLogout = () => {
      Swal.fire({
        title: 'Yakin mau logout?',
        text: "Kamu akan keluar dari akun ini.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, logout!',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          // Hapus token dari localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
    
          // Hapus token dari cookies (jika disimpan di sana)
          Cookies.remove('token');
          Cookies.remove('user');
    
          Swal.fire({
            title: 'Berhasil logout',
            text: 'Kamu telah keluar dari akun.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
    
          // Redirect setelah logout
          navigate('/');
        }
      });
    };
    
    
  
    return (
      <div className="container">
        
        <Header title="Profile" />
        
        <div className="profile-container">
          <div className="avatar-profile">
            <img id="avatar-profile" src="https://imgv3.fotor.com/images/blog-cover-image/10-profile-picture-ideas-to-make-you-stand-out.jpg" alt="Avatar" />
            <div className="edit-avatar">
              <MdOutlineEdit />
            </div>
          </div>
  
          <div className="data-profile">
            {/* Nama */}
            <div className="profile-name">
              <span className="icon"><HiOutlineUser /></span>
              <span className="underline">{userData.nama}</span>
              <span className='edit-icon' onClick={() => handleEditClick('nama')}><MdOutlineEdit /></span>
            </div>
  
            {/* Jabatan */}
            <div className="profile-position">
              <span className="icon"><IoBriefcaseOutline /></span>
              <span className="underline">{userData.divisi}</span>
              <span className='edit-icon' onClick={() => handleEditClick('jabatan')}><MdOutlineEdit /></span>
            </div>
  
            {/* Email */}
            <div className="profile-email">
              <span className="icon"><IoMailOutline /></span>
              <span className="underline">{userData.email}</span>
              <span className='edit-icon' onClick={() => handleEditClick('email')}><MdOutlineEdit /></span>
            </div>
  
            {/* Password */}
            <div className="profile-password">
              <span className="icon"><IoLockClosedOutline /></span>
              <span className="underline">{'****'}</span> {/* Password ditampilkan sebagai asteris */}
              <span className='edit-icon' onClick={() => handleEditClick('password')}><MdOutlineEdit /></span>
            </div>
          </div>
        </div>
  
        {/* Modal Bootstrap */}
                {modalOpen && (
          <>
            <div className="modal-backdrop fade show"></div>
            <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content shadow">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit {currentEditField.charAt(0).toUpperCase() + currentEditField.slice(1)}</h5>
                    <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
                  </div>
                  <div className="modal-body">
                    <input
                      type={currentEditField === 'password' ? 'password' : 'text'}
                      className="form-control"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder={`Masukkan ${currentEditField}`}
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>Simpan</button>
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Batal</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

          <div className="card mt-4">
            <div className="card-body text-center text-warning">
              ⚠️ Disarankan untuk login ulang setelah mengubah data profil agar perubahan dapat diterapkan sepenuhnya.
            </div>
          </div>

          <div className="d-grid gap-2 mt-3">
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </div>


        </div>
    );
}

export default Profile