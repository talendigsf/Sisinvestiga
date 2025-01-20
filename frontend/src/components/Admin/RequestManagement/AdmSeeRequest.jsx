import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Table, Card, Button, Form, Spinner, Alert, Modal } from 'react-bootstrap';
import { FaFilter, FaSync, FaEdit, FaTrash, FaUndo } from 'react-icons/fa';
import AlertComponent from '../../Common/AlertComponent';
import { getDataParams, putData, deleteData } from '../../../services/apiServices';
import '../../../css/Admin/AdmSeeRequest.css';
import AdmPagination from '../Common/AdmPagination';

const AdmSeeRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ estado: '', tipoSolicitud: '' });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updateData, setUpdateData] = useState({ estado: '', comentarios: '' });

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getDataParams('requests', { 
        page: currentPage, 
        limit: 6,  
        estado: filters.estado, 
        tipoSolicitud: filters.tipoSolicitud 
      });
      setRequests(response.solicitudes);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      setError('Error al cargar las solicitudes. Por favor, intente de nuevo.');
      AlertComponent.error('Error al cargar las solicitudes');
    }
    setLoading(false);
  }, [currentPage, filters.estado, filters.tipoSolicitud]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleUpdateClick = (request) => {
    setSelectedRequest(request);
    setUpdateData({ estado: request.estado, comentarios: '' });
    setShowUpdateModal(true);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async () => {
    try {
      await putData('requests', selectedRequest._id, updateData);
      AlertComponent.success('Solicitud actualizada exitosamente');
      setShowUpdateModal(false);
      fetchRequests();
    } catch (err) {
      AlertComponent.error('Error al actualizar la solicitud');
    }
  };

  const handleDelete = async (id) => {
    const result = await AlertComponent.warning("Está seguro de que desea eliminar esta solicitud?");
    if (result.isConfirmed) {
      try {
        await deleteData("requests", id);
        AlertComponent.success("Solicitud eliminada con éxito");
        fetchRequests();
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

  const handleRestore = async (id) => {
    try {
      await putData(`requests/${id}`, 'restore');
      AlertComponent.success('Solicitud restaurada exitosamente');
      fetchRequests();
    } catch (err) {
      AlertComponent.error('Error al restaurar la solicitud');
    }
  };

  return (
    <>
      <Container fluid className="mt-4">
        <Row className="mb-4">
          <Col>
            <h1 className="titulo-solicitud">Gestión de Solicitudes</h1>
          </Col>
        </Row>

        <Card>
          <Card.Body>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label><FaFilter /> Filtrar por Estado</Form.Label>
                  <Form.Control
                    as="select"
                    name="estado"
                    value={filters.estado}
                    onChange={handleFilterChange}
                  >
                    <option value="">Todos</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Aprobada">Aprobada</option>
                    <option value="Rechazada">Rechazada</option>
                    <option value="En Proceso">En Proceso</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label><FaFilter /> Filtrar por Tipo</Form.Label>
                  <Form.Control
                    as="select"
                    name="tipoSolicitud"
                    value={filters.tipoSolicitud}
                    onChange={handleFilterChange}
                  >
                    <option value="">Todos</option>
                    <option value="Unirse a Proyecto">Unirse a Proyecto</option>
                    <option value="Recursos">Recursos</option>
                    <option value="Aprobación">Aprobación</option>
                    <option value="Permiso">Permiso</option>
                    <option value="Otro">Otro</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex align-items-end">
                <Button variant="outline-secondary" onClick={fetchRequests}>
                  <FaSync /> Actualizar
                </Button>
              </Col>
            </Row>

            {loading ? (
              <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </Spinner>
              </div>
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : requests.length === 0 ? (
              <Alert variant="info">No hay solicitudes que mostrar.</Alert>
            ) : (
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                    <th>Fecha de Creación</th>
                    <th>Actualizado</th>
                    <th>Proyecto</th>
                    <th>Solicitante</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request._id}>
                      <td>{request.tipoSolicitud}</td>
                      <td>{request.descripcion}</td>
                      <td>
                        <span className={`badge bg-${
                          request.estado === 'Aprobada' ? 'success' :
                          request.estado === 'Rechazada' ? 'danger' :
                          request.estado === 'En Proceso' ? 'warning' : 'info'
                        }`}>
                          {request.estado}
                        </span>
                      </td>
                      <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                      <td>{new Date(request.updatedAt).toLocaleDateString()}</td>
                      <td>{request.proyecto ? request.proyecto.nombre : 'N/A'}</td>
                      <td>{`${request.solicitante.nombre} ${request.solicitante.apellido}`}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" onClick={() => handleUpdateClick(request)} className="me-2">
                          <FaEdit /> Actualizar
                        </Button>
                        {request.isDeleted ? (
                          <Button variant="outline-warning" size="sm" onClick={() => handleRestore(request._id)}>
                            <FaUndo /> Restaurar
                          </Button>
                        ) : (
                          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(request._id)}>
                            <FaTrash /> Eliminar
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}

            <div className="d-flex justify-content-center mt-4">
              <AdmPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </Card.Body>
        </Card>
      </Container>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                name="estado"
                value={updateData.estado}
                onChange={handleUpdateChange}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobada">Aprobada</option>
                <option value="Rechazada">Rechazada</option>
                <option value="En Proceso">En Proceso</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Comentarios</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="comentarios"
                value={updateData.comentarios}
                onChange={handleUpdateChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowUpdateModal(false)}>
            Cancelar
          </Button>
          <Button variant="outline-primary" onClick={handleUpdateSubmit}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AdmSeeRequest