import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import {
  FaUser,
  FaCalendarAlt,
  FaBook,
  FaLanguage,
  FaTag,
  FaPaperclip,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";
import Nav from "../../../components/Home/Common/Nav";
import { getDataById } from "../../../services/apiServices";
import AuthorModal from "../../../components/Home/AuthorModal";
import "../../../css/Home/PublicationsDetails.css";

const PublicationDetailViews = () => {
  const { id } = useParams();
  const [publication, setPublication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    const fetchPublicationDetails = async () => {
      try {
        const data = await getDataById("publications/getpublication", id);
        setPublication(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los detalles de la publicación", error);
        setLoading(false);
      }
    };

    fetchPublicationDetails();
  }, [id]);

  const handleAuthorClick = (author) => {
    setSelectedAuthor(author);
    setIsAuthorModalOpen(true);
  };

  const closeAuthorModal = () => {
    setIsAuthorModalOpen(false);
    setSelectedAuthor(null);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (loading) {
    return (
      <div>
        <Nav />
        <div className="publication-details__loading">
          <div className="publication-details__spinner"></div>
          <p>Cargando detalles de la publicación...</p>
        </div>
      </div>
    );
  }

  if (!publication) {
    return (
      <div>
        <Nav />
        <div className="publication-details__error">
          <p>No se pudo encontrar la publicación.</p>
          <Link to="/" className="publication-details__back-link">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Nav />
      <div className="publication-details">
        <div className="publication-details__container">
          <nav className="publication-details__breadcrumb">
            <Link to="/">Inicio</Link> <FaChevronRight />{" "}
            <span>{publication.titulo}</span>
          </nav>
          <h1 className="publication-details__title">{publication.titulo}</h1>
          <p className="publication-details__resumen">{publication.resumen}</p>

          <div className="publication-details__section">
            <h2
              onClick={() => toggleSection("info")}
              className="publication-details__section-title"
            >
              Información General{" "}
              {expandedSections.info ? <FaChevronDown /> : <FaChevronRight />}
            </h2>
            {expandedSections.info && (
              <div className="publication-details__section-content">
                <p>
                  <FaBook /> <strong>Revista:</strong> {publication.revista}
                </p>
                <p>
                  <FaCalendarAlt /> <strong>Fecha de Publicación:</strong>{" "}
                  {format(new Date(publication.fecha), "dd/MM/yyyy")}
                </p>
                <p>
                  <strong>Tipo de Publicación:</strong>{" "}
                  {publication.tipoPublicacion}
                </p>
                <p>
                  <FaLanguage /> <strong>Idioma:</strong> {publication.idioma}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  <span
                    className={`publication-details__status publication-details__status--${publication.estado.toLowerCase()}`}
                  >
                    {publication.estado}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="publication-details__section">
            <h2
              onClick={() => toggleSection("authors")}
              className="publication-details__section-title"
            >
              Autores{" "}
              {expandedSections.authors ? (
                <FaChevronDown />
              ) : (
                <FaChevronRight />
              )}
            </h2>
            {expandedSections.authors && (
              <ul className="publication-details__authors-list">
                {publication.autores.map((autor) => (
                  <li
                    key={autor._id}
                    className="publication-details__author-item"
                  >
                    <button
                      onClick={() => handleAuthorClick(autor)}
                      className="publication-details__author-button"
                    >
                      <FaUser /> {autor.nombre} {autor.apellido}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="publication-details__section">
            <h2
              onClick={() => toggleSection("keywords")}
              className="publication-details__section-title"
            >
              Palabras Clave{" "}
              {expandedSections.keywords ? (
                <FaChevronDown />
              ) : (
                <FaChevronRight />
              )}
            </h2>
            {expandedSections.keywords && (
              <div className="publication-details__keywords">
                {publication.palabrasClave.map((palabra, index) => (
                  <span key={index} className="publication-details__keyword">
                    <FaTag /> {palabra}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="publication-details__section">
            <h2
              onClick={() => toggleSection("attachments")}
              className="publication-details__section-title"
            >
              Anexos{" "}
              {expandedSections.attachments ? (
                <FaChevronDown />
              ) : (
                <FaChevronRight />
              )}
            </h2>
            {expandedSections.attachments && (
              <ul className="publication-details__attachments-list">
                {publication.anexos.map((anexo, index) => (
                  <li
                    key={index}
                    className="publication-details__attachment-item"
                  >
                    <FaPaperclip />{" "}
                    {anexo.url && anexo.nombre ? (
                      <a
                        href={anexo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {anexo.nombre}
                      </a>
                    ) : (
                      <span>{anexo.nombre || "Anexo sin nombre"}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="publication-details__section">
            <h2
              onClick={() => toggleSection("project")}
              className="publication-details__section-title"
            >
              Proyecto Asociado{" "}
              {expandedSections.project ? (
                <FaChevronDown />
              ) : (
                <FaChevronRight />
              )}
            </h2>
            {expandedSections.project && (
              <div className="publication-details__section-content">
                <Link
                  to={`/proyectos/${publication.proyecto._id}`}
                  className="publication-details__project-link"
                >
                  {publication.proyecto.nombre}
                </Link>
              </div>
            )}
          </div>
        </div>

        {isAuthorModalOpen && (
          <AuthorModal autor={selectedAuthor} onClose={closeAuthorModal} />
        )}
      </div>
    </>
  );
};

export default PublicationDetailViews;
