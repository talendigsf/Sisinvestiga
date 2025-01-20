import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router";
import NavInvestigator from "../../../components/Investigator/Common/NavInvestigator";
import AlertComponent from "../../../components/Common/AlertComponent";
import Pagination from "../../../components/Common/Pagination";
import InvSearchBar from "../../../components/Investigator/Common/InvSearchBar";
import InvPublicationCard from "./InvPublicationCard";
import { getUserData, deleteData } from "../../../services/apiServices";
import "../../../css/Investigator/InvestigatorPublications.css";

const InvSeePublication = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicationViews = async () => {
      try {
        const data = await getUserData("publications", { page, limit: 6, search: searchTerm });
        if (data && data.publications) {
          setPublications(data.publications);
          setTotalPages(data.totalPages);
        } else {
          setPublications([]);
          setTotalPages(1);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar las publicaciones", error);
        setError("Error al cargar las publicaciones");
        setLoading(false);
      }
    };

    fetchPublicationViews();
  }, [page, searchTerm]);

  const handleAddPublication = () => {
    navigate("/invest/publicaciones/agregar");
  };

  const handleEditPublication = (publicationId) => {
    navigate(`/invest/publicaciones/editar/${publicationId}`);
  };

  const handleViewDetails = (id) => {
    navigate(`/invest/detalles/publicacion/${id}`);
  };

  const handleDeletePublication = async (publicationId) => {
    try {
      const result = await AlertComponent.warning(
        "¿Estás seguro que deseas eliminar esta publicación?"
      );
      if (result.isConfirmed) {
        await deleteData("publications", publicationId);
        AlertComponent.success("La publicación ha sido eliminada correctamente.");
        setPublications(publications.filter((publication) => publication._id !== publicationId));
      }
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
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando Publicaciones...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <>
      <NavInvestigator />
      <div className="investigator-publications">
        <div className="investigator-publications__header">
          <h1 className="investigator-publications__title">Mis Publicaciones</h1>
          <div className="investigator-publications__toolbar">
            <InvSearchBar
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Buscar publicaciones..."
            />
            <button 
              className="investigator-publications__add-btn" 
              onClick={handleAddPublication}
            >
              <FaPlus className="investigator-publications__add-icon" />
              <span>Agregar Publicación</span>
            </button>
          </div>
        </div>

        <div className="investigator-publications__grid">
          {publications.length > 0 ? (
            publications.map((publication) => (
              <InvPublicationCard
                key={publication._id}
                publication={publication}
                onEdit={handleEditPublication}
                onDelete={handleDeletePublication}
                onViewDetails={handleViewDetails}
              />
            ))
          ) : (
            <p className="investigator-publications__empty">
              No tienes publicaciones aún. ¡Agrega una nueva!
            </p>
          )}
        </div>

        {publications.length > 0 && (
          <div className="investigator-publications__pagination">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onNext={() => setPage((prevPage) => Math.min(prevPage + 1, totalPages))}
              onPrev={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
              disabledPrev={page === 1}
              disabledNext={page === totalPages}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default InvSeePublication;