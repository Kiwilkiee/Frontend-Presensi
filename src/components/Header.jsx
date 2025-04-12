import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

function Header({ title }) {
  const navigate = useNavigate();

  return (
      <div className="headers ">
        <span className="back-button" onClick={() => navigate('/home')}>
          <FaArrowLeft size={24} />
        </span>
        <p className="mx-auto">{title}</p>
        <span></span>
      </div>
  )
}

export default Header
