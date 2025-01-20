import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import AdmProjectCard from './AdmProjectCard';
import AdmProjectDetailsModal from './AdmProjectDetailsModal';
import AdmPagination from '../Common/AdmPagination';
import { getDataParams } from '../../../services/apiServices';
import AlertComponent from '../../Common/AlertComponent';
import AdmProjectFilter from './AdmProjectFilter';

const AdmProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('Todos');

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {};

      if (estadoSeleccionado !== 'Todos' && estadoSeleccionado !== 'Eliminado') {
        filters.estado = estadoSeleccionado;
        filters.isDeleted = false;
      } else if (estadoSeleccionado === 'Eliminado') {
        filters.isDeleted = true;
      } else {
        filters.isDeleted = false;
      }

      if (searchTerm) {
        filters.nombre = searchTerm;
      }

      const response = await getDataParams('projects', { page: currentPage, limit: 6, ...filters });
      setProjects(response.projects);
      setTotalPages(response.totalPages);
    } catch (error) {
      AlertComponent.error('Error al cargar los proyectos');
    } finally {
      setLoading(false);
    }
  }, [currentPage, estadoSeleccionado, searchTerm]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleFilter = (estado) => {
    setEstadoSeleccionado(estado);
    setCurrentPage(1);
  };

  const handleViewDetails = (proyecto) => {
    setSelectedProyecto(proyecto);
  };

  const handleCloseModal = () => {
    setSelectedProyecto(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <AdmProjectFilter onSearch={handleSearch} onFilter={handleFilter} />
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          {projects.length === 0 ? (
            <Alert variant="info" className="text-center my-5">
              <Alert.Heading>No se encontraron proyectos</Alert.Heading>
              <p>Intenta ajustar los filtros de búsqueda.</p>
            </Alert>
          ) : (
            <>
              <Row className="project-grid">
                {projects.map((proyecto) => (
                  <Col sm={12} md={6} lg={4} key={proyecto._id} className="mb-4">
                    <AdmProjectCard
                      proyecto={proyecto}
                      onViewDetails={handleViewDetails}
                      fetchProjects={fetchProjects}
                    />
                  </Col>
                ))}
              </Row>
              <AdmPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </>
      )}
      {selectedProyecto && (
        <AdmProjectDetailsModal
          proyecto={selectedProyecto}
          handleClose={handleCloseModal}
          handlePrint={() => window.print()}
        />
      )}
    </div>
  );
};

export default AdmProjectList;