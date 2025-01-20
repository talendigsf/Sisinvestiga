import React from "react";
import { FaEdit, FaTrash, FaCalendar, FaMoneyBillWave, FaChartLine, FaEye } from "react-icons/fa";
import "../../../css/Investigator/InvestigatorProjects.css";

const InvProjectCard = ({ project, onEdit, onDelete, onViewDetails }) => {
  const getStatusClass = (status) => {
    const statusMap = {
      'Planeado': 'planned',
      'En Proceso': 'in-progress',
      'Finalizado': 'completed'
    };
    return statusMap[status] || 'default';
  };

  return (
    <div className="investigator-projects__card">
      <div className="investigator-projects__card-header">
        <h3 className="investigator-projects__card-title">{project.nombre}</h3>
        <span className={`investigator-projects__status investigator-projects__status--${getStatusClass(project.estado)}`}>
          {project.estado}
        </span>
      </div>
      <p className="investigator-projects__description">{project.descripcion}</p>
      <div className="investigator-projects__info">
        <div className="investigator-projects__info-item">
          <FaMoneyBillWave className="investigator-projects__icon" />
          <span className="investigator-projects__text">
            <strong>Presupuesto:</strong> ${project.presupuesto.toLocaleString()}
          </span>
        </div>
        <div className="investigator-projects__info-item">
          <FaCalendar className="investigator-projects__icon" />
          <span className="investigator-projects__text">
            <strong>Inicio:</strong> {new Date(project.cronograma.fechaInicio).toLocaleDateString()}
          </span>
        </div>
        <div className="investigator-projects__info-item">
          <FaChartLine className="investigator-projects__icon" />
          <span className="investigator-projects__text">
            <strong>Progreso:</strong> {project.progreso || '0'}%
          </span>
        </div>
      </div>
      <div className="investigator-projects__actions">
        <button 
          className="investigator-projects__button investigator-projects__button--view" 
          onClick={() => onViewDetails(project._id)}
        >
          <FaEye /> Ver Detalles
        </button>
        <button 
          className="investigator-projects__button investigator-projects__button--edit" 
          onClick={() => onEdit(project._id)}
        >
          <FaEdit /> Editar
        </button>
        <button 
          className="investigator-projects__button investigator-projects__button--delete" 
          onClick={() => onDelete(project._id)}
        >
          <FaTrash /> Eliminar
        </button>
      </div>
    </div>
  );
};

export default InvProjectCard;