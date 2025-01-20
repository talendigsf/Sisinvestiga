import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaUsers, 
  FaMoneyBillWave, 
  FaClipboardList,
  FaFileAlt,
  FaTools
} from 'react-icons/fa';
import { getDataById } from '../../../services/apiServices';
import '../../../css/Investigator/InvProjectDetails.css';

const InvProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const data = await getDataById('projects', id);
        setProject(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los detalles del proyecto');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="project-details__loading">
        <div className="project-details__spinner"></div>
        <p>Cargando detalles del proyecto...</p>
      </div>
    );
  }

  const getStatusClass = (status) => {
    const statusMap = {
      'Planeado': 'planeado',
      'En Proceso': 'en-proceso',
      'Finalizado': 'finalizado',
      'Cancelado': 'cancelado'
    };
    return statusMap[status] || 'default';
  };

  if (error) {
    return <div className="project-details__error">{error}</div>;
  }

  if (!project) {
    return <div className="project-details__not-found">Proyecto no encontrado</div>;
  }

  return (
    <>
      <div className="project-details">
        <div className="project-details__container">
          <header className="project-details__header">
            <div className="project-details__header-content">
              <h1 className="project-details__title">{project.nombre}</h1>
              <span className={`project-details__status project-details__status--${getStatusClass(project.estado)}`}>
              {project.estado}
              </span>
            </div>
            {project.imagen && (
              <img 
                src={project.imagen} 
                alt={project.titulo}
                className="project-details__cover-image"
              />
            )}
          </header>

          <section className="project-details__section">
            <h2 className="project-details__section-title">
              <FaFileAlt className="project-details__icon" />
              Descripción
            </h2>
            <p className="project-details__description">{project.descripcion}</p>
          </section>

          <div className="project-details__grid">
            <section className="project-details__card">
              <h2 className="project-details__card-title">
                <FaMoneyBillWave className="project-details__icon" />
                Presupuesto
              </h2>
              <p className="project-details__card-content">
                ${project.presupuesto.toLocaleString()}
              </p>
            </section>

            <section className="project-details__card">
              <h2 className="project-details__card-title">
                <FaCalendarAlt className="project-details__icon" />
                Cronograma
              </h2>
              <div className="project-details__dates">
                <p>
                  <strong>Inicio:</strong>{' '}
                  {new Date(project.cronograma.fechaInicio).toLocaleDateString()}
                </p>
                <p>
                  <strong>Fin:</strong>{' '}
                  {new Date(project.cronograma.fechaFin).toLocaleDateString()}
                </p>
              </div>
            </section>
          </div>

          <section className="project-details__section">
            <h2 className="project-details__section-title">
              <FaUsers className="project-details__icon" />
              Investigadores
            </h2>
            <div className="project-details__investigators">
              {project.investigadores.map((investigador) => (
                <div key={investigador._id} className="project-details__investigator-card">
                  <img
                    src={investigador.fotoPerfil || '/placeholder.svg?height=100&width=100'}
                    alt={`${investigador.nombre} ${investigador.apellido}`}
                    className="project-details__investigator-image"
                  />
                  <div className="project-details__investigator-info">
                    <h3>{`${investigador.nombre} ${investigador.apellido}`}</h3>
                    <p>{investigador.especializacion}</p>
                    <small>{investigador.responsabilidades}</small>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {project.recursos && project.recursos.length > 0 && (
            <section className="project-details__section">
              <h2 className="project-details__section-title">
                <FaTools className="project-details__icon" />
                Recursos
              </h2>
              <ul className="project-details__resources">
                {project.recursos.map((recurso, index) => (
                  <li key={index} className="project-details__resource-item">
                    {recurso}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.hitos && project.hitos.length > 0 && (
            <section className="project-details__section">
              <h2 className="project-details__section-title">
                <FaClipboardList className="project-details__icon" />
                Hitos
              </h2>
              <div className="project-details__milestones">
                {project.hitos.map((hito, index) => (
                  <div key={index} className="project-details__milestone-card">
                    <div className="project-details__milestone-header">
                      <h3>{hito.nombre}</h3>
                      <span className="project-details__milestone-date">
                        {new Date(hito.fecha).toLocaleDateString()}
                      </span>
                    </div>
                    {hito.entregable && (
                      <p className="project-details__milestone-deliverable">
                        {hito.entregable}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default InvProjectDetails;