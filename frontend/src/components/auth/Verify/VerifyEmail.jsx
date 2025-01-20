import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { verifyUserEmail } from '../../../features/auth/authSlice';
import backgroundImage from '../../../assets/img/ucsd.webp'; 
import logo from '../../../assets/img/LogoUCSD.jpg';
import '../../../css/auth/VerifyEmail.css';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error, success } = useSelector((state) => state.auth);

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const handleVerify = () => {
    if (token) {
      dispatch(verifyUserEmail(token));
    }
  };

  useEffect(() => {
    if (status === 'succeeded') {
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  }, [status, navigate]);

  return (
    <div className="verify-email-page">
      <div className="verify-email-left">
        <img src={backgroundImage} alt="UCSD Campus" className="background-image" />
      </div>
      <div className="verify-email-right">
        <div className="verify-email-container">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Logo UCSD" className="logo" />
          </Link>
          <h1>Verificación de Email</h1>
          {status === 'loading' ? (
            <p>Verificando su email, por favor espere...</p>
          ) : status === 'succeeded' ? (
            <div className="verification-success">
              <FaCheckCircle className="icon success" />
              <p>{success}</p>
            </div>
          ) : status === 'failed' ? (
            <div className="verification-error">
              <FaExclamationTriangle className="icon error" />
              <p>{error}</p>
            </div>
          ) : (
            <div className="verification-prompt">
              <p>Haz clic en el botón para verificar tu email.</p>
              <button onClick={handleVerify} className="verify-button">Verificar Email</button>
              {error && <p className="error">{error}</p>}
            </div>
          )}
          <Link to="/login" className="verify-nav-link">Volver al Inicio de Sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
