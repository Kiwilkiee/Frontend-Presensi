import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

function Header({ title }) {
  const navigate = useNavigate();

  return (
      <div className="header d-flex align-items-center">
        <span className="back-button" onClick={() => navigate('/home')}>
          <FaArrowLeft size={24} />
        </span>
        <h1 className="mx-auto">{title}</h1>
        <span></span>
      </div>
  )
}

export default Header
