import React from 'react';
import { FaTimes, FaGraduationCap, FaTasks } from 'react-icons/fa';
import '../../css/Home/AuthorModal.css'

const AuthorModal = ({ autor, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="author-modal__overlay" onClick={handleOverlayClick}>
      <div className="author-modal">
        <button className="author-modal__close" onClick={onClose}>
          <FaTimes />
        </button>
        <div className="author-modal__content">
          <img
            src={autor.fotoPerfil || 'https://via.placeholder.com/120'}
            alt={`${autor.nombre} ${autor.apellido}`}
            className="author-modal__photo"
          />
          <h2 className="author-modal__name">
            {autor.nombre} {autor.apellido}
          </h2>
          <p className="author-modal__info">
            <FaGraduationCap className="author-modal__icon" />
            <strong>Especialización:</strong> {autor.especializacion || 'No disponible'}
          </p>
          <p className="author-modal__info">
            <FaTasks className="author-modal__icon" />
            <strong>Responsabilidades:</strong> {autor.responsabilidades || 'No disponible'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthorModal;