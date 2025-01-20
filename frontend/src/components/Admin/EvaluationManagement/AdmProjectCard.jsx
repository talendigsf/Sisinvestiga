import React from 'react';
import { Card, Button, ListGroup } from 'react-bootstrap';
import { FaClipboardCheck } from 'react-icons/fa';

const AdmProjectCard = ({ project, onEvaluate }) => {
  const { nombre, descripcion, objetivos, presupuesto, cronograma, investigadores } = project;

  return (
    <Card className="project-card mb-4 h-100">
      <Card.Header className="bg-primary text-white">
        <strong>{nombre}</strong>
      </Card.Header>
      <Card.Body>
        <Card.Text><strong>Description:</strong> {descripcion || 'No disponible'}</Card.Text>
        <Card.Text><strong>Objectives:</strong> {objetivos || 'No disponible'}</Card.Text>
        <Card.Text>
          <strong>Budget:</strong> {presupuesto !== undefined ? `$${presupuesto.toLocaleString()}` : 'No disponible'}
        </Card.Text>
        <Card.Text><strong>Schedule:</strong></Card.Text>
        {cronograma && cronograma.fechaInicio && cronograma.fechaFin ? (
          <ListGroup variant="flush" className="mb-3">
            <ListGroup.Item><strong>Start:</strong> {new Date(cronograma.fechaInicio).toLocaleDateString()}</ListGroup.Item>
            <ListGroup.Item><strong>End:</strong> {new Date(cronograma.fechaFin).toLocaleDateString()}</ListGroup.Item>
          </ListGroup>
        ) : (
          <Card.Text>No schedule available.</Card.Text>
        )}
        <Card.Text><strong>Researchers:</strong></Card.Text>
        {investigadores && investigadores.length > 0 ? (
          <ListGroup variant="flush"> 
            {investigadores.map((investigador) => (
              <ListGroup.Item key={investigador._id}>{investigador.nombre} {investigador.apellido}</ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <Card.Text>No researchers assigned.</Card.Text>
        )}
      </Card.Body>
      <Card.Footer className="d-flex justify-content-end">
        <Button variant="primary" onClick={() => onEvaluate(project)}>
          <FaClipboardCheck className="me-2" /> Evaluate
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default AdmProjectCard;