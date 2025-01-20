import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import EvaluationCard from './EvaluationCard';
import EvaluationFormModal from './EvaluationFormModal';
import AdmPagination from '../Common/AdmPagination';
import { getDataParams } from '../../../services/apiServices';
import AlertComponent from '../../Common/AlertComponent';

const EvaluationsList = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEvaluations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getDataParams('evaluations/all', { page: currentPage, limit: 6 });
      setEvaluations(response.evaluations);
      setTotalPages(response.totalPages);
    } catch (error) {
      AlertComponent.error('Error loading evaluations');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchEvaluations();
  }, [fetchEvaluations]);

  const handleEdit = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvaluation(null);
    fetchEvaluations();
  };

  return (
    <div className="evaluations-list">
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : evaluations.length === 0 ? (
        <div className="text-center my-5">
          <h4>No evaluations available</h4>
          <p>No evaluations have been conducted yet.</p>
        </div>
      ) : (
        <>
          <Row>
            {evaluations.map((evaluation) => (
              <Col sm={12} md={6} lg={4} key={evaluation._id} className="mb-4">
                <EvaluationCard
                  evaluation={evaluation}
                  onEdit={handleEdit}
                  refreshData={fetchEvaluations}
                />
              </Col>
            ))}
          </Row>
          <AdmPagination
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
          evaluation={selectedEvaluation}
          refreshData={fetchEvaluations}
        />
      )}
    </div>
  );
};

export default EvaluationsList;