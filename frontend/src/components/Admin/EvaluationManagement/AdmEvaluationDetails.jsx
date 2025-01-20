import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { FaStar, FaCalendarAlt, FaUserAlt, FaProjectDiagram } from 'react-icons/fa';
import { getDataById } from '../../../services/apiServices';
import AlertComponent from '../../Common/AlertComponent';
import '../../../css/Admin/AdmEvaluationDetails.css';

const AdmEvaluationDetails = () => {
  const { projectId } = useParams();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvaluation = useCallback(async () => {
    try {
      const data = await getDataById('evaluations/projects/Admin', projectId);
      setEvaluations(data);
      setError(null);
    } catch (err) {
      setError('Error loading evaluation. Please try again.');
      AlertComponent.error('Error loading evaluation');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchEvaluation();
  }, [fetchEvaluation]);

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

  return (
    <Container className="my-4 evaluation-details">
      <h2 className="text-primary mb-4">Project Evaluations</h2>
      {evaluations.length === 0 ? (
        <Alert variant="info">There are no evaluations for this project.</Alert>
      ) : (
        evaluations.map((evaluation) => (
          <Card key={evaluation._id} className="mb-4 evaluation-card">
            <Card.Header as="h3" className="bg-primary text-white d-flex justify-content-between align-items-center">
              <span>Evaluation #{evaluation._id.substr(-4)}</span>
              <Badge bg={evaluation.isDeleted ? "danger" : "success"}>
                {evaluation.isDeleted ? "Delete" : "Active"}
              </Badge>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <FaProjectDiagram className="icon-spacing" />
                    <strong>Project:</strong> {evaluation.project.nombre}
                  </div>
                  <div className="mb-3">
                    <FaStar className="icon-spacing" />
                    <strong>Score:</strong> {evaluation.puntuacion}/100
                  </div>
                  <div className="mb-3">
                    <FaCalendarAlt className="icon-spacing" />
                    <strong>Evaluation Date:</strong> {new Date(evaluation.fechaEvaluacion).toLocaleDateString()}
                  </div>
                  <div className="mb-3">
                    <FaUserAlt className="icon-spacing" />
                    <strong>Evaluator:</strong> {evaluation.evaluator.nombre} {evaluation.evaluator.apellido}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Comments:</strong>
                    <p className="evaluation-comments">{evaluation.comentarios}</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}

export default AdmEvaluationDetails