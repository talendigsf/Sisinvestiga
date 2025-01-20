import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentRole } from '../../features/auth/authSlice';
import { FaLock, FaArrowLeft } from 'react-icons/fa';
import logo from '../../assets/img/LogoUCSD.jpg'
import '../../css/Pages/NotAcces.css';

const Unauthorized = () => {
  const role = useSelector(selectCurrentRole);

  const getRedirectLink = () => {
    switch (role) {
      case 'Administrador':
        return '/admin';
      case 'Investigador':
        return '/invest';
      default:
        return '/';
    }
  };

  const getRedirectText = () => {
    switch (role) {
      case 'Administrador':
        return 'Volver al Panel de Administración';
      case 'Investigador':
        return 'Volver al Panel de Investigador';
      default:
        return 'Volver a la Página de Inicio';
    }
  };

  return (
    <div className="error-page">
      <div className="error-content">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Logo UCSD" className="logo" />
        </Link>
        <div className="error-icon">
          <FaLock />
        </div>
        <h1>403 - Acceso No Autorizado</h1>
        <p>No tienes permisos para acceder a esta página.</p>
        <Link to={getRedirectLink()} className="not-nav-link">
          <FaArrowLeft className="icon-left" />
          {getRedirectText()}
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;