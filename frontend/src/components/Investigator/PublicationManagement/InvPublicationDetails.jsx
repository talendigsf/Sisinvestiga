import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaUsers, 
  FaBook, 
  FaGlobe,
  FaProjectDiagram,
  FaTags,
  FaPaperclip,
  FaFileAlt
} from 'react-icons/fa';
import { getDataById } from '../../../services/apiServices';
import '../../../css/Investigator/InvPublicationDetails.css';

const InvPublicationDetails = () => {
  const { id } = useParams();
  const [publication, setPublication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicationDetails = async () => {
      try {
        const data = await getDataById('publications/getpublication', id);
        setPublication(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los detalles de la publicación');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicationDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="publication-details__loading">
        <div className="publication-details__spinner"></div>
        <p>Cargando detalles de la publicación...</p>
      </div>
    );
  }

  if (error) {
    return <div className="publication-details__error">{error}</div>;
  }

  if (!publication) {
    return <div className="publication-details__not-found">Publicación no encontrada</div>;
  }

  return (
    <>
      <div className="publication-details">
        <div className="publication-details__container">
          <header className="publication-details__header">
            <div className="publication-details__header-content">
              <h1 className="publication-details__title">{publication.titulo}</h1>
              <span className={`publication-details__status publication-details__status--${publication.estado.toLowerCase()}`}>
                {publication.estado}
              </span>
            </div>
            {publication.imagen && (
              <img 
                src={publication.imagen} 
                alt={publication.titulo}
                className="publication-details__cover-image"
              />
            )}
          </header>

          <div className="publication-details__grid">
            <section className="publication-details__card">
              <h2 className="publication-details__card-title">
                <FaBook className="publication-details__icon" />
                Revista
              </h2>
              <p className="publication-details__card-content">{publication.revista}</p>
            </section>

            <section className="publication-details__card">
              <h2 className="publication-details__card-title">
                <FaCalendarAlt className="publication-details__icon" />
                Fecha de Publicación
              </h2>
              <p className="publication-details__card-content">
                {new Date(publication.fecha).toLocaleDateString()}
              </p>
            </section>

            <section className="publication-details__card">
              <h2 className="publication-details__card-title">
                <FaFileAlt className="publication-details__icon" />
                Tipo
              </h2>
              <p className="publication-details__card-content">{publication.tipoPublicacion}</p>
            </section>

            <section className="publication-details__card">
              <h2 className="publication-details__card-title">
                <FaGlobe className="publication-details__icon" />
                Idioma
              </h2>
              <p className="publication-details__card-content">{publication.idioma}</p>
            </section>
          </div>

          <section className="publication-details__section">
            <h2 className="publication-details__section-title">
              <FaFileAlt className="publication-details__icon" />
              Resumen
            </h2>
            <p className="publication-details__description">{publication.resumen}</p>
          </section>

          <section className="publication-details__section">
            <h2 className="publication-details__section-title">
              <FaUsers className="publication-details__icon" />
              Autores
            </h2>
            <div className="publication-details__authors">
              {publication.autores.map((autor) => (
                <div key={autor._id} className="publication-details__author-card">
                  <img
                    src={autor.fotoPerfil || '/placeholder.svg?height=100&width=100'}
                    alt={`${autor.nombre} ${autor.apellido}`}
                    className="publication-details__author-image"
                  />
                  <div className="publication-details__author-info">
                    <h3>{`${autor.nombre} ${autor.apellido}`}</h3>
                    <p>{autor.especializacion}</p>
                    <span className="publication-details__author-role">
                      {autor.role?.roleName || 'Investigador'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="publication-details__section">
            <h2 className="publication-details__section-title">
              <FaProjectDiagram className="publication-details__icon" />
              Proyecto Asociado
            </h2>
            <div className="publication-details__project">
              <h3>{publication.proyecto.nombre}</h3>
            </div>
          </section>

          {publication.palabrasClave && publication.palabrasClave.length > 0 && (
            <section className="publication-details__section">
              <h2 className="publication-details__section-title">
                <FaTags className="publication-details__icon" />
                Palabras Clave
              </h2>
              <div className="publication-details__keywords">
                {publication.palabrasClave.map((palabra, index) => (
                  <span key={index} className="publication-details__keyword">
                    {palabra}
                  </span>
                ))}
              </div>
            </section>
          )}

          {publication.anexos && publication.anexos.length > 0 && (
            <section className="publication-details__section">
              <h2 className="publication-details__section-title">
                <FaPaperclip className="publication-details__icon" />
                Anexos
              </h2>
              <div className="publication-details__attachments">
                {publication.anexos.map((anexo, index) => (
                  <a
                    key={index}
                    href={anexo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="publication-details__attachment"
                  >
                    <FaFileAlt className="publication-details__attachment-icon" />
                    <span>{anexo.nombre}</span>
                    <small>({anexo.tipo})</small>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default InvPublicationDetails;