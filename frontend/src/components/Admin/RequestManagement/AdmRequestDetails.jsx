import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaUndo } from 'react-icons/fa';
import { getDataById, putData, deleteData } from '../../../services/apiServices';
import AlertComponent from '../../Common/AlertComponent';
import AdmModalRequest from './AdmModalRequest';
import '../../../css/Admin/AdmRequestDetails.css';

const AdmRequestDetails = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchRequest = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDataById('requests/admin', id);
      setRequest(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar la solicitud. Por favor, intente de nuevo.');
      AlertComponent.error('Error al cargar la solicitud');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleUpdateRequest = async (updatedData) => {
    try {
      await putData('requests', id, updatedData);
      AlertComponent.success('Solicitud actualizada con éxito');
      fetchRequest();
    } catch (error) {
      AlertComponent.error('Error al actualizar la solicitud');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    const result = await AlertComponent.warning("¿Está seguro de que desea eliminar esta solicitud?");
    if (result.isConfirmed) {
      try {
        await deleteData('requests', id);
        AlertComponent.success("Solicitud eliminada con éxito");
        fetchRequest();
      } catch (error) {
        let errorMessage = "Ocurrió un error durante la eliminación del registro.";
        let detailedErrors = [];

        try {
          const parsedError = JSON.parse(error.message);
          errorMessage = parsedError.message;
          detailedErrors = parsedError.errors || [];
        } catch (parseError) {
          errorMessage = error.message;
        }
        AlertComponent.error(errorMessage);
        detailedErrors.forEach((err) => AlertComponent.error(err));
      }
    }
  };

  const handleRestore = async () => {
    try {
      await putData(`requests/${id}`, 'restore');
      AlertComponent.success('Solicitud restaurada con éxito');
      fetchRequest();
    } catch (error) {
      AlertComponent.error('Error al restaurar la solicitud');
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!request) {
    return <Alert variant="info">No se encontró la solicitud.</Alert>;
  }

  return (
    <>
      <Container className="my-4">
      <h2 className="text-primary mb-4">Detalles de la Solicitud</h2>
      <Card className="mb-4">
        <Card.Header as="h3" className="bg-primary text-white">
          Solicitud de {request.tipoSolicitud}
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Tipo de Solicitud:</strong> {request.tipoSolicitud}</p>
              <p><strong>Estado:</strong> 
                <Badge bg={
                  request.estado === 'Aprobada' ? 'success' :
                  request.estado === 'Rechazada' ? 'danger' :
                  request.estado === 'En Proceso' ? 'warning' : 'info'
                } className="ms-2">
                  {request.estado}
                </Badge>
              </p>
              <p><strong>Fecha de Creación:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
              <p><strong>Última Actualización:</strong> {new Date(request.updatedAt).toLocaleDateString()}</p>
            </Col>
            <Col md={6}>
              <p><strong>Solicitante:</strong> {`${request.solicitante.nombre} ${request.solicitante.apellido}`}</p>
              <p><strong>Proyecto:</strong> {request.proyecto ? request.proyecto.nombre : 'N/A'}</p>
              <p><strong>Revisado por:</strong> {request.revisadoPor ? `${request.revisadoPor.nombre} ${request.revisadoPor.apellido}` : 'No revisado aún'}</p>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <p><strong>Descripción:</strong></p>
              <p>{request.descripcion}</p>
            </Col>
          </Row>
          {request.comentarios && request.comentarios.length > 0 && (
            <Row className="mt-3">
              <Col>
                <h4>Comentarios:</h4>
                {request.comentarios.map((comentario, index) => (
                  <Card key={index} className="mb-2">
                    <Card.Body>
                      <p>{comentario.comentario}</p>
                      <small className="text-muted">Por: {comentario.usuario.nombre} {comentario.usuario.apellido} - {new Date(comentario.fecha).toLocaleString()}</small>
                    </Card.Body>
                  </Card>
                ))}
              </Col>
            </Row>
          )}
        </Card.Body>
        <Card.Footer className="d-flex justify-content-end">
          {!request.isDeleted ? (
            <>
              <Button variant="warning" className="me-2" onClick={handleEdit}>
                <FaEdit /> Editar
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                <FaTrash /> Eliminar
              </Button>
            </>
          ) : (
            <Button variant="success" onClick={handleRestore}>
              <FaUndo /> Restaurar
            </Button>
          )}
        </Card.Footer>
        </Card>

        <AdmModalRequest
          show={showEditModal}
          handleClose={handleCloseEditModal}
          request={request}
          onUpdate={handleUpdateRequest}
        />
      </Container>
    </>
  );
}

export default AdmRequestDetails