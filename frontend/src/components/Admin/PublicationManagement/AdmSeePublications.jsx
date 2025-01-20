import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, Card, Table, Button, Badge, Alert, Form, Spinner
} from 'react-bootstrap';
import { FaEye, FaTrash, FaPaperclip, FaSearch, FaUndo } from 'react-icons/fa';
import { getDataParams, deleteData, putData } from '../../../services/apiServices';
import AdmPagination from '../Common/AdmPagination';
import AlertComponent from '../../../components/Common/AlertComponent';
import '../../../css/Admin/AdmSeePublications.css';
import notimage from '../../../assets/img/notimage.png';

const AdmSeePublications = () => {
  const [publicationsData, setPublicationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    tipoPublicacion: '',
    estado: '',
    isDeleted: ''
  });
  const navigate = useNavigate();

  const fetchPublications = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        titulo: searchTerm || undefined,
        tipoPublicacion: filters.tipoPublicacion || undefined,
        estado: filters.estado || undefined,
        isDeleted: filters.isDeleted || undefined,
      };

      const response = await getDataParams('publications', params);
      setPublicationsData(response.publications);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (error) {
      console.error("Error al obtener las publicaciones", error);
      setError("Error al cargar las publicaciones. Por favor, intente de nuevo.");
      AlertComponent.error("Error al cargar las publicaciones");
    }
    setLoading(false);
  }, [currentPage, searchTerm, filters]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPublications();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchPublications]);

  const handleDelete = async (id) => {
    const result = await AlertComponent.warning("¿Está seguro de que desea eliminar esta publicación?");
    if (result.isConfirmed) {
      try {
        await deleteData("publications", id);
        AlertComponent.success("Publicación eliminada con éxito");
        fetchPublications();
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
        await putData(`publications/restore`, id, {}); 
        AlertComponent.success("Publicación restaurada con éxito");
        fetchPublications();
      } catch (error) {
        let errorMessage = "Ocurrió un error durante la restauración del registro.";
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
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 'true' : '') : value
    }));
    setCurrentPage(1);
  };

  const handleShowDetails = (publicationId) => {
    navigate(`/admin/publicaciones/editar/${publicationId}`);
  };

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col>
          <h1 className="adm-pub-title">Gestión de Publicaciones</h1>
        </Col>
      </Row>
      <Card>
        <Card.Body>
          <Row className="mb-3 align-items-end">
            <Col md={4}>
              <Form.Group controlId="searchTerm">
                <Form.Label><FaSearch style={{ color: '#006747' }} /> Buscar por título</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="tipoPublicacion">
                <Form.Label>Tipo de Publicación</Form.Label>
                <Form.Control
                  as="select"
                  name="tipoPublicacion"
                  value={filters.tipoPublicacion}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos los tipos</option>
                  <option value="Articulo">Artículo</option>
                  <option value="Informe">Informe</option>
                  <option value="Tesis">Tesis</option>
                  <option value="Presentacion">Presentación</option>
                  <option value="Otro">Otro</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={filters.estado}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos los estados</option>
                  <option value="Borrador">Borrador</option>
                  <option value="Revisado">Revisado</option>
                  <option value="Publicado">Publicado</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group controlId="isDeleted">
                <Form.Check
                  type="checkbox"
                  label="Mostrar eliminados"
                  name="isDeleted"
                  checked={filters.isDeleted === 'true'}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
          </Row>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Imagen</th>
                      <th>Título</th>
                      <th>Autores</th>
                      <th>Tipo</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th>Anexos</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publicationsData.map((publication) => (
                      <tr key={publication._id}>
                        <td>
                          <img
                            src={publication.imagen || notimage}
                            alt={publication.titulo}
                            className="publication-thumbnail"
                          />
                        </td>
                        <td>{publication.titulo}</td>
                        <td>{publication.autores.map(autor => `${autor.nombre} ${autor.apellido}`).join(', ')}</td>
                        <td>{publication.tipoPublicacion}</td>
                        <td>
                          <Badge bg={
                            publication.estado === 'Publicado' ? 'success' :
                              publication.estado === 'Revisado' ? 'warning' : 'secondary'
                          }>
                            {publication.estado}
                          </Badge>
                        </td>
                        <td>{new Date(publication.fecha).toLocaleDateString()}</td>
                        <td>
                          {publication.anexos && publication.anexos.length > 0 ? (
                            <Button variant="link" onClick={() => handleShowDetails(publication._id)}>
                              <FaPaperclip /> {publication.anexos.length}
                            </Button>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td>
                          {publication.isDeleted ? (
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleRestore(publication._id)}
                            >
                              <FaUndo /> Restaurar
                            </Button>
                          ) : (
                            <>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-2"
                                onClick={() => handleShowDetails(publication._id)}
                              >
                                <FaEye /> Ver/Editar
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(publication._id)}
                              >
                                <FaTrash /> Eliminar
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              {totalPages > 1 && (
                <AdmPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdmSeePublications;
