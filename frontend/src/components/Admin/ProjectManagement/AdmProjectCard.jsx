import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaInfoCircle, FaTrash, FaEdit, FaUndo } from 'react-icons/fa';
import AlertComponent from '../../Common/AlertComponent';
import { useNavigate } from 'react-router-dom';
import { deleteData, putData } from '../../../services/apiServices';

const AdmProjectCard = ({ proyecto, onViewDetails, fetchProjects }) => {
  const navigate = useNavigate();

  const handleEditProject = (id) => {
    navigate(`/adm/proyectos/editar/${id}`);
  };

  const handleDeleteProject = async () => {
    try {
      const result = await AlertComponent.warning(
        'Are you sure you want to delete this project?'
      );
      if (result.isConfirmed) {
        await deleteData('projects', proyecto._id);
        AlertComponent.success('The project has been successfully deleted.');
        fetchProjects();
      }
    } catch (error) {
      AlertComponent.error('An error occurred while deleting the record.');
    }
  };

  const handleRestoreProject = async () => {
    try {
      await putData('projects/restore', `${proyecto._id}`);
      AlertComponent.success('The project has been successfully restored.');
      fetchProjects();
    } catch (error) {
      AlertComponent.error('An error occurred while restoring the project.');
    }
  };

  const getStatusClass = (status) => {
    const statusMap = {
      'Planeado': 'planned',
      'En Proceso': 'in-progress',
      'Completado': 'completed',
      'Cancelado': 'canceled'
    };
    return statusMap[status] || 'default';
  };

  return (
    <Card className={`project-card h-100 ${proyecto.isDeleted ? 'deleted-project' : ''}`}>
      <Card.Body>
        <Card.Title className="project-title">{proyecto.nombre}</Card.Title>
        <span bg={proyecto.isDeleted ? 'danger' : 'primary'} className={`adm-projects-card__status adm-projects-card__status--${getStatusClass(proyecto.estado)} mb-2`}>
          {proyecto.estado}
        </span>
        <Card.Text>
          <strong>Objectives:</strong> {proyecto.objetivos || 'N/A'} <br />
          <strong>Budget:</strong> ${proyecto.presupuesto?.toLocaleString() || 'N/A'} <br />
          <strong>Start Date:</strong> {new Date(proyecto.cronograma.fechaInicio).toLocaleDateString()} <br />
          <strong>Deadline:</strong> {new Date(proyecto.cronograma.fechaFin).toLocaleDateString()}
        </Card.Text>
      </Card.Body>
      <Card.Footer className="d-flex flex-column">
        {proyecto.isDeleted ? (
          <Button variant="outline-success" className="w-100" onClick={handleRestoreProject}>
            <FaUndo /> Restore
          </Button>
        ) : (
          <>
            <Button variant="outline-primary" className="w-100 mb-2" onClick={() => onViewDetails(proyecto)}>
              <FaInfoCircle /> View Details
            </Button>
            <Button variant="outline-secondary" className="w-100 mb-2" onClick={() => handleEditProject(proyecto._id)}>
              <FaEdit /> Edit
            </Button>
            <Button variant="outline-danger" className="w-100" onClick={handleDeleteProject}>
              <FaTrash /> Delete
            </Button>
          </>
        )}
      </Card.Footer>
    </Card>
  );
}

export default AdmProjectCard;