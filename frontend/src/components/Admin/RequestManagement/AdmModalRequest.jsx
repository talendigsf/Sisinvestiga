import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import AlertComponent from '../../Common/AlertComponent';

const AdmModalRequest = ({ show, handleClose, request, onUpdate }) => {
  const [formData, setFormData] = useState({
    estado: '',
    comentarios: ''
  });

  useEffect(() => {
    if (request) {
      setFormData({
        estado: request.estado || '',
        comentarios: ''
      });
    }
  }, [request]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onUpdate(formData);
      handleClose();
    } catch (error) {
      AlertComponent.error('Error al actualizar la solicitud');
      console.error(error);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione un estado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobada">Aprobada</option>
                <option value="Rechazada">Rechazada</option>
                <option value="En Proceso">En Proceso</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nuevo Comentario</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="comentarios"
                value={formData.comentarios}
                onChange={handleInputChange}
                placeholder="Añadir un nuevo comentario (opcional)"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AdmModalRequest