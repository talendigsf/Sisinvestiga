import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import AdmProjectCard from './AdmProjectCard';
import EvaluationFormModal from './EvaluationFormModal';
import Pagination from '../../Common/Pagination';
import { getDataParams } from '../../../services/apiServices';
import AlertComponent from '../../Common/AlertComponent';

const UnEvaluatedProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const projectsResponse = await getDataParams('projects', { page: currentPage, limit: 6 });
      const evaluationsResponse = await getDataParams('evaluations/all', { limit: 0 });
      const evaluatedProjectIds = evaluationsResponse.evaluations.map(eva => eva.project._id);
      const unEvaluated = projectsResponse.projects.filter(
        project => !evaluatedProjectIds.includes(project._id)
      );
      setProjects(unEvaluated);
      setTotalPages(projectsResponse.totalPages);
    } catch (error) {
      AlertComponent.error('Error loading projects');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleEvaluate = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject(null);
    fetchProjects();
  };

  return (
    <div className="unevaluated-projects-list">
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : projects.length === 0 ? (
        <Alert variant="info" className="text-center">
          <Alert.Heading>No projects pending evaluation</Alert.Heading>
          <p>All projects have been evaluated!</p>
        </Alert>
      ) : (
        <>
          <Row>
            {projects.map((project) => (
              <Col sm={12} md={6} lg={4} key={project._id} className="mb-4">
                <AdmProjectCard project={project} onEvaluate={handleEvaluate} />
              </Col>
            ))}
          </Row>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
      {showModal && (
        <EvaluationFormModal
          show={showModal}
          handleClose={handleCloseModal}
          project={selectedProject}
          refreshData={fetchProjects}
        />
      )}
    </div>
  );
};

export default UnEvaluatedProjectsList;