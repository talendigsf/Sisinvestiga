import React from 'react';
import { FaTimes, FaGraduationCap, FaTasks } from 'react-icons/fa';
import '../../css/Investigator/InvestigatorModal.css';

const InvestigatorModal = ({ investigador, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="investigator-modal__overlay" onClick={handleOverlayClick}>
      <div className="investigator-modal">
        <button className="investigator-modal__close" onClick={onClose}>
          <FaTimes />
        </button>
        <div className="investigator-modal__content">
          <img
            src={investigador.fotoPerfil || 'https://via.placeholder.com/120'}
            alt={`${investigador.nombre} ${investigador.apellido}`}
            className="investigator-modal__photo"
          />
          <h2 className="investigator-modal__name">
            {investigador.nombre} {investigador.apellido}
          </h2>
          <p className="investigator-modal__info">
            <FaGraduationCap className="investigator-modal__icon" />
            <strong>Especialización:</strong> {investigador.especializacion || 'No disponible'}
          </p>
          <p className="investigator-modal__info">
            <FaTasks className="investigator-modal__icon" />
            <strong>Responsabilidades:</strong> {investigador.responsabilidades || 'No disponible'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvestigatorModal;
