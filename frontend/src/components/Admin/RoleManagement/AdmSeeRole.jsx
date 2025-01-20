import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Table, Card, Button, Form, Modal, Alert, Spinner, Badge
} from 'react-bootstrap';
import {
  FaPlus, FaEdit, FaTrash, FaUndo, FaSearch
} from 'react-icons/fa';
import {
  getData, postData, putData, deleteData
} from '../../../services/apiServices';
import AlertComponent from '../../Common/AlertComponent';
import '../../../css/Admin/AdmSeeRole.css';
import AdmPagination from '../Common/AdmPagination';

const AdmSeeRole = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleForm, setRoleForm] = useState({ roleName: '' });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await getData('roles');
      setRoles(response);
      setError(null);
    } catch (err) {
      setError('Error al cargar los roles. Por favor, intente de nuevo.');
      AlertComponent.error('Error al cargar los roles');
    }
    setLoading(false);
  };

  const handleShowModal = (mode, role = null) => {
    setModalMode(mode);
    setSelectedRole(role);
    setRoleForm(role ? { roleName: role.roleName } : { roleName: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRole(null);
    setRoleForm({ roleName: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoleForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await postData('roles', roleForm);
        AlertComponent.success('Rol creado exitosamente');
      } else {
        await putData('roles', selectedRole._id, roleForm);
        AlertComponent.success('Rol actualizado exitosamente');
      }
      handleCloseModal();
      fetchRoles();
    } catch (err) {
      AlertComponent.error(`Error al ${modalMode === 'create' ? 'crear' : 'actualizar'} el rol`);
    }
  };

  const handleDelete = async (id) => {
    const result = await AlertComponent.warning("¿Está seguro de que desea eliminar este rol?");
    if (result.isConfirmed) {
      try {
        await deleteData("roles", id);
        AlertComponent.success("Rol eliminado con éxito");
        fetchRoles();
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
      await putData(`roles/${id}`, 'restore');
      AlertComponent.success('Rol restaurado exitosamente');
      fetchRoles();
    } catch (err) {
      AlertComponent.error('Error al restaurar el rol');
    }
  };

  // Filtrar roles según el término de búsqueda
  const filteredRoles = roles.filter((role) =>
    role.roleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cálculo de paginación
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRoles = filteredRoles.slice(indexOfFirstItem, indexOfLastItem);

  // Reiniciar currentPage si excede totalPages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <Container fluid className="mt-4">
        <Row className="mb-4 align-items-center">
          <Col>
            <h1 className="titulo-roles">Gestión de Roles</h1>
          </Col>
          <Col xs="auto">
            <Button variant="outline-primary" onClick={() => handleShowModal('create')}>
              <FaPlus /> Nuevo Rol
            </Button>
          </Col>
        </Row>

        <Card>
          <Card.Body>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="searchRole">
                  <Form.Label><FaSearch /> Buscar rol</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); 
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>Nombre del Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentRoles.map((role) => (
                  <tr key={role._id} className={role.isDeleted ? 'table-danger' : ''}>
                    <td>{role.roleName}</td>
                    <td>
                      <Badge bg={role.isDeleted ? 'danger' : 'success'}>
                        {role.isDeleted ? 'Inactivo' : 'Activo'}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => handleShowModal('update', role)}
                        className="me-2"
                      >
                        <FaEdit /> Editar
                      </Button>
                      {role.isDeleted ? (
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => handleRestore(role._id)}
                        >
                          <FaUndo /> Restaurar
                        </Button>
                      ) : (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(role._id)}
                        >
                          <FaTrash /> Eliminar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Componente de Paginación */}
            {totalPages > 1 && (
              <AdmPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </Card.Body>
        </Card>

        {/* Modal para Crear/Editar Rol */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{modalMode === 'create' ? 'Crear Nuevo Rol' : 'Editar Rol'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Nombre del Rol</Form.Label>
                <Form.Control
                  type="text"
                  name="roleName"
                  value={roleForm.roleName}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="outline-primary" type="submit">
                {modalMode === 'create' ? 'Crear' : 'Actualizar'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </>
  );
};

export default AdmSeeRole;
