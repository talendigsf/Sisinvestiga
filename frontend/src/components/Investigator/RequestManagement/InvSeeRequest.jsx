import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Table, Card, Button, Form, Pagination, Spinner, Alert } from 'react-bootstrap';
import { FaPlus, FaFilter, FaSync } from 'react-icons/fa';
import NavInvestigator from '../Common/NavInvestigator';
import AlertComponent from '../../Common/AlertComponent';
import { getUserData, postData } from '../../../services/apiServices';
import '../../../css/Investigator/InvRequestView.css';

const InvSeeRequest = () => {
  const [requests, setRequests] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ estado: '', tipoSolicitud: '' });
  const [showForm, setShowForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    tipoSolicitud: '',
    descripcion: '',
    proyecto: ''
  });

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUserData('requests', { 
        page, 
        limit: 10, 
        estado: filters.estado, 
        tipoSolicitud: filters.tipoSolicitud 
      });
      setRequests(response.solicitudes);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      const errorMessage = JSON.parse(err.message);
      setError(errorMessage.message || 'Error al cargar las solicitudes. Por favor, intente de nuevo.');
      AlertComponent.error(errorMessage.message || 'Error al cargar las solicitudes');
    }
    setLoading(false);
  }, [page, filters.estado, filters.tipoSolicitud]);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await getUserData('projects');
      console.log('Respuesta de proyectos:', response);
      setProjects(response.data || []);
    } catch (err) {
      console.error('Error al obtener proyectos:', err);
      AlertComponent.error('Error al cargar los proyectos');
    }
  }, []);

  useEffect(() => {
    fetchRequests();
    fetchProjects();
  }, [fetchRequests, fetchProjects]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleNewRequestChange = (e) => {
    const { name, value } = e.target;
    setNewRequest(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postData('requests', newRequest);
      AlertComponent.success('Solicitud creada exitosamente');
      setShowForm(false);
      setNewRequest({ tipoSolicitud: '', descripcion: '', proyecto: '' });
      fetchRequests();
    } catch (err) {
      const errorMessage = JSON.parse(err.message);
      AlertComponent.error(errorMessage.message || 'Error al crear la solicitud');
      if (errorMessage.errors) {
        errorMessage.errors.forEach(error => AlertComponent.error(error));
      }
    }
    setLoading(false);
  };

  const renderPagination = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === page} onClick={() => handlePageChange(number)}>
          {number}
        </Pagination.Item>,
      );
    }
    return <Pagination>{items}</Pagination>;
  };

  return (
    <>
      <NavInvestigator />
      <Container fluid className="mt-4">
        <Row className="mb-4">
          <Col>
            <h1 className="titulo-solicitud">Mis Solicitudes</h1>
          </Col>
          <Col xs="auto">
            <Button variant="success" onClick={() => setShowForm(!showForm)}>
              <FaPlus /> Nueva Solicitud
            </Button>
          </Col>
        </Row>

        {showForm && (
          <Card className="mb-4">
            <Card.Body>
              <Form onSubmit={handleSubmitNewRequest}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Solicitud</Form.Label>
                  <Form.Control
                    as="select"
                    name="tipoSolicitud"
                    value={newRequest.tipoSolicitud}
                    onChange={handleNewRequestChange}
                    required
                  >
                    <option value="">Seleccione un tipo</option>
                    <option value="Unirse a Proyecto">Unirse a Proyecto</option>
                    <option value="Recursos">Recursos</option>
                    <option value="Aprobación">Aprobación</option>
                    <option value="Permiso">Permiso</option>
                    <option value="Otro">Otro</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="descripcion"
                    value={newRequest.descripcion}
                    onChange={handleNewRequestChange}
                    required
                  />
                </Form.Group>
                {['Unirse a Proyecto', 'Recursos', 'Aprobación'].includes(newRequest.tipoSolicitud) && (
                  <Form.Group className="mb-3">
                    <Form.Label>Proyecto</Form.Label>
                    <Form.Control
                      as="select"
                      name="proyecto"
                      value={newRequest.proyecto}
                      onChange={handleNewRequestChange}
                      required
                    >
                      <option value="">Seleccione un proyecto</option>
                      {Array.isArray(projects) && projects.length > 0 ? (
                        projects.map((project) => (
                          <option key={project._id} value={project._id}>
                            {project.nombre}
                          </option>
                        ))
                      ) : (
                        <option value="">No hay proyectos disponibles</option>
                      )}
                    </Form.Control>
                  </Form.Group>
                )}
                <Button type="submit" variant="primary">Enviar Solicitud</Button>
              </Form>
            </Card.Body>
          </Card>
        )}

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
                <Button variant="secondary" onClick={fetchRequests}>
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
                    <th>Proyecto</th>
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
                      <td>{request.proyecto ? request.proyecto.nombre : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}

            <div className="d-flex justify-content-center mt-4">
              {renderPagination()}
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default InvSeeRequest