import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineEdit } from "react-icons/md";
import { HiOutlineUser } from "react-icons/hi";
import { IoMailOutline, IoBriefcaseOutline, IoLockClosedOutline } from "react-icons/io5";
import axios from '../../api'; 
import Header from '../../components/Header.jsx';



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
              <span className="underline">{userData.jabatan}</span>
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
        <div className={`modal fade ${modalOpen ? 'show' : ''}`} style={{ display: modalOpen ? 'block' : 'none' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit {currentEditField.charAt(0).toUpperCase() + currentEditField.slice(1)}</h5>
                <button type="button" className="close" aria-label="Close" onClick={handleCloseModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <input
                  type={currentEditField === 'password' ? 'password' : 'text'}
                  className="form-control"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>Save</button>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default Profile