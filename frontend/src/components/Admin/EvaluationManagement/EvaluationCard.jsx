import React from 'react';
import { Card, Button, Badge, ListGroup } from 'react-bootstrap';
import { FaEdit, FaTrash, FaUndo } from 'react-icons/fa';
import AlertComponent from '../../Common/AlertComponent';
import { deleteData, putData } from '../../../services/apiServices';

const EvaluationCard = ({ evaluation, onEdit, refreshData }) => {
  const { project, puntuacion, comentarios, fechaEvaluacion, isDeleted } = evaluation;

  const handleDelete = async () => {
    const result = await AlertComponent.warning('Are you sure you want to delete this evaluation?');
    if (result.isConfirmed) {
      try {
        await deleteData('evaluations', evaluation._id);
        AlertComponent.success('Evaluation successfully deleted');
        refreshData();
      } catch (error) {
        AlertComponent.error('Error deleting the evaluation');
      }
    }
  };

  const handleRestore = async () => {
    try {
      await putData(`evaluations/${evaluation._id}`, 'restore');
      AlertComponent.success('Evaluation successfully restored');
      refreshData();
    } catch (error) {
      AlertComponent.error('Error restoring the evaluation');
    }
  };

  return (
    <Card className={`evaluation-card h-100 ${isDeleted ? 'bg-light' : ''}`}>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <strong>{project.nombre}</strong>
        <Badge bg={isDeleted ? 'secondary' : 'primary'} pill>
          {isDeleted ? 'Deleted' : 'Active'}
        </Badge>
      </Card.Header>
      <Card.Body>
        <Card.Text><strong>Project Description:</strong> {project.descripcion}</Card.Text>
        <Card.Text><strong>Objectives:</strong> {project.objetivos}</Card.Text>
        <Card.Text><strong>Budget:</strong> ${project.presupuesto?.toLocaleString() || 'N/A'}</Card.Text>
        <Card.Text><strong>Schedule:</strong></Card.Text>
        {project.cronograma ? (
          <ListGroup variant="flush" className="mb-3">
            <ListGroup.Item><strong>Start:</strong> {new Date(project.cronograma.fechaInicio).toLocaleDateString()}</ListGroup.Item>
            <ListGroup.Item><strong>End:</strong> {new Date(project.cronograma.fechaFin).toLocaleDateString()}</ListGroup.Item>
          </ListGroup>
        ) : (
          <Card.Text>No schedule available.</Card.Text>
        )}
        <Card.Text><strong>Researchers:</strong></Card.Text>
        {project.investigadores && project.investigadores.length > 0 ? (
          <ListGroup variant="flush" className="mb-3">
            {project.investigadores.map((investigador) => (
              <ListGroup.Item key={investigador._id}>{investigador.nombre} {investigador.apellido}</ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <Card.Text>No researchers assigned.</Card.Text>
        )}
        <Card.Text><strong>Score:</strong> {puntuacion}</Card.Text>
        <Card.Text><strong>Comments:</strong> {comentarios}</Card.Text>
        <Card.Text><strong>Evaluated:</strong> {new Date(fechaEvaluacion).toLocaleDateString()}</Card.Text>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-end">
        {!isDeleted ? (
          <>
            <Button variant="outline-primary" className="me-2" onClick={() => onEdit(evaluation)}>
              <FaEdit /> Edit
            </Button>
            <Button variant="outline-danger" onClick={handleDelete}>
              <FaTrash /> Delete
            </Button>
          </>
        ) : (
          <Button variant="outline-success" onClick={handleRestore}>
            <FaUndo /> Restore
          </Button>
        )}
      </Card.Footer>
    </Card>
  );
};

export default EvaluationCard;