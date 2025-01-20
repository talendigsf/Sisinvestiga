import React from 'react';
import { FaEdit, FaTrash, FaBook, FaFileAlt, FaGlobe, FaEye } from 'react-icons/fa';
import "../../../css/Investigator/InvestigatorPublications.css";

const InvPublicationCard = ({ publication, onEdit, onDelete, onViewDetails }) => {
  const getStatusClass = (status) => {
    const statusMap = {
      'Borrador': 'draft',
      'Publicado': 'published',
      'Rechazado': 'rejected'
    };
    return statusMap[status] || 'default';
  };

  return (
    <div className="investigator-publications__card">
      <div className="investigator-publications__card-header">
        <h3 className="investigator-publications__card-title">
          {publication.titulo}
        </h3>
        <span className={`investigator-publications__status investigator-publications__status--${getStatusClass(publication.estado)}`}>
          {publication.estado}
        </span>
      </div>
      
      <p className="investigator-publications__summary">{publication.resumen}</p>
      
      <div className="investigator-publications__info">
        <div className="investigator-publications__info-item">
          <FaBook className="investigator-publications__icon" />
          <span className="investigator-publications__text">
            <strong>Revista:</strong> {publication.revista}
          </span>
        </div>
        <div className="investigator-publications__info-item">
          <FaFileAlt className="investigator-publications__icon" />
          <span className="investigator-publications__text">
            <strong>Tipo:</strong> {publication.tipoPublicacion}
          </span>
        </div>
        <div className="investigator-publications__info-item">
          <FaGlobe className="investigator-publications__icon" />
          <span className="investigator-publications__text">
            <strong>Idioma:</strong> {publication.idioma}
          </span>
        </div>
      </div>
      
      <div className="investigator-publications__actions">
        <button 
            className="investigator-publications__button investigator-publications__button--view" 
            onClick={() => onViewDetails(publication._id)}
          >
          <FaEye /> Ver Detalles
        </button>
        <button 
          className="investigator-publications__button investigator-publications__button--edit" 
          onClick={() => onEdit(publication._id)}
        >
          <FaEdit /> Editar
        </button>
        <button 
          className="investigator-publications__button investigator-publications__button--delete" 
          onClick={() => onDelete(publication._id)}
        >
          <FaTrash /> Eliminar
        </button>
      </div>
    </div>
  );
};

export default InvPublicationCard;