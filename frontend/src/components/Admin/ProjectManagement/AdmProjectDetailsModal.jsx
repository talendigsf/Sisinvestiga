import React from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import { FaPrint, FaTimes } from 'react-icons/fa';

const AdmProjectDetailsModal = ({ proyecto, handleClose, handlePrint }) => {
  return (
    <Modal show={true} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{proyecto.nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush">
          <ListGroup.Item><strong>Descripción:</strong> {proyecto.descripcion}</ListGroup.Item>
          <ListGroup.Item><strong>Objetivos:</strong> {proyecto.objetivos}</ListGroup.Item>
          <ListGroup.Item><strong>Presupuesto:</strong> ${proyecto.presupuesto?.toLocaleString()}</ListGroup.Item>
          <ListGroup.Item><strong>Fecha de Inicio:</strong> {new Date(proyecto.cronograma.fechaInicio).toLocaleDateString()}</ListGroup.Item>
          <ListGroup.Item><strong>Fecha de Fin:</strong> {new Date(proyecto.cronograma.fechaFin).toLocaleDateString()}</ListGroup.Item>
          <ListGroup.Item><strong>Estado:</strong> {proyecto.estado}</ListGroup.Item>
        </ListGroup>
        <h5 className="mt-4">Hitos:</h5>
        {proyecto.hitos && proyecto.hitos.length > 0 ? (
          <ListGroup>
            {proyecto.hitos.map((hito, index) => (
              <ListGroup.Item key={index}>
                <strong>{hito.nombre}</strong> - {new Date(hito.fecha).toLocaleDateString()}
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>No hay hitos disponibles.</p>
        )}
        <h5 className="mt-4">Recursos:</h5>
        {proyecto.recursos && proyecto.recursos.length > 0 ? (
          <ListGroup>
            {proyecto.recursos.map((recurso, index) => (
              <ListGroup.Item key={index}>{recurso}</ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>No hay recursos disponibles.</p>
        )}
        <h5 className="mt-4">Investigadores:</h5>
        {proyecto.investigadores && proyecto.investigadores.length > 0 ? (
          <ListGroup>
            {proyecto.investigadores.map((investigador, index) => (
              <ListGroup.Item key={index}>{investigador.nombre} {investigador.apellido}</ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>No hay investigadores disponibles.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <FaTimes /> Cerrar
        </Button>
        <Button variant="primary" onClick={handlePrint}>
          <FaPrint /> Imprimir Detalles
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AdmProjectDetailsModal;