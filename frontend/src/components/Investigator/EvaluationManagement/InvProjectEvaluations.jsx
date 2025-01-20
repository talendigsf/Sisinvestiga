import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getData } from '../../../services/apiServices';
import NavInvestigator from '../../../components/Investigator/Common/NavInvestigator';
import AlertComponent from '../../Common/AlertComponent';
import '../../../css/Investigator/InvProjectEvaluations.css';

const RatingBar = ({ rating }) => {
  const percentage = (rating / 5) * 100;
  return (
    <div className="rating-bar-container">
      <div className="rating-bar" style={{ width: `${percentage}%` }}>
        <span className="rating-value">{rating.toFixed(1)}</span>
      </div>
    </div>
  );
};

export default function Component() {
  const [evaluations, setEvaluations] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { projectId } = useParams();

  const fetchEvaluations = useCallback(async () => {
    try {
      const response = await getData(`evaluations/projects/${projectId}`);
      setEvaluations(response);
      if (response.length > 0) {
        setProject(response[0].project);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      AlertComponent.error('Error al cargar las evaluaciones. Por favor, inténtelo de nuevo.');
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchEvaluations();
  }, [fetchEvaluations]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando evaluaciones...</p>
      </div>
    );
  }

  return (
    <div className="inv-project-evaluations">
      <NavInvestigator />
      <div className="container py-5">
        <h1 className="text-center mb-5">Evaluaciones del Proyecto</h1>
        {project && (
          <div className="card mb-5 project-info">
            <div className="card-body">
              <h2 className="card-title">{project.nombre}</h2>
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Descripción:</strong> {project.descripcion}</p>
                  <p><strong>Objetivos:</strong> {project.objetivos}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Presupuesto:</strong> ${project.presupuesto.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {evaluations.length > 0 ? (
          <div className="row">
            {evaluations.map((evaluation) => (
              <div key={evaluation._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 evaluation-card">
                  <div className="card-body">
                    <h3 className="card-title mb-3">{evaluation.evaluator.nombre} {evaluation.evaluator.apellido}</h3>
                    <RatingBar rating={evaluation.puntuacion} />
                    <p className="text-muted mt-3 mb-3">{evaluation.evaluator.email}</p>
                    <p className="card-text">{evaluation.comentarios}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center fs-4 text-muted">No hay evaluaciones disponibles para este proyecto.</p>
        )}
      </div>
    </div>
  );
}