import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router";
import NavInvestigator from "../../../components/Investigator/Common/NavInvestigator";
import AlertComponent from "../../../components/Common/AlertComponent";
import InvProjectCard from "./InvProjectCard";
import Pagination from "../../../components/Common/Pagination";
import InvSearchBar from "../Common/InvSearchBar";
import { getUserData, deleteData } from "../../../services/apiServices";
import "../../../css/Investigator/InvestigatorProjects.css";

const InvSeeProject = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectViews = async () => {
      try {
        const data = await getUserData("projects", { page, limit: 6, search: searchTerm });
        if (data && data.data) {
          setProjects(data.data);
          setTotalPages(Math.ceil(data.total / data.limit));
        } else {
          setProjects([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los proyectos", error);
        setError("Error al cargar los proyectos");
        setLoading(false);
      }
    };

    fetchProjectViews();
  }, [page, searchTerm]);

  const handleAddProject = () => {
    navigate("/invest/proyectos/agregar");
  };

  const handleEditProject = (projectId) => {
    navigate(`/invest/proyectos/editar/${projectId}`);
  };

  const handleViewDetails = (id) => {
    navigate(`/invest/detalles/proyecto/${id}`);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const result = await AlertComponent.warning(
        "¿Estás seguro que deseas eliminar este proyecto?"
      );
      if (result.isConfirmed) {
        await deleteData("projects", projectId);
        AlertComponent.success("El proyecto ha sido eliminado correctamente.");
        setProjects(projects.filter((project) => project._id !== projectId));
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
        <p>Cargando Proyectos...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <>
      <NavInvestigator />
      <div className="investigator-projects">
        <div className="investigator-projects__header">
          <h1 className="investigator-projects__title">Mis Proyectos</h1>
          <div className="investigator-projects__toolbar">
            <InvSearchBar
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Buscar proyectos..."
            />
            <button className="investigator-projects__add-btn" onClick={handleAddProject}>
              <FaPlus className="investigator-projects__add-icon" />
              <span>Agregar Proyecto</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="investigator-projects__loading">
            <div className="loading-spinner"></div>
          </div>
        ) : error ? (
          <div className="investigator-projects__error">{error}</div>
        ) : (
          <>
            <div className="investigator-projects__grid">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <InvProjectCard
                    key={project._id}
                    project={project}
                    onEdit={handleEditProject}
                    onDelete={handleDeleteProject}
                    onViewDetails={handleViewDetails}
                  />
                ))
              ) : (
                <div className="investigator-projects__empty">
                  No tienes proyectos aún. ¡Agrega uno nuevo!
                </div>
              )}
            </div>

            {projects.length > 0 && (
              <div className="investigator-projects__pagination">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onNext={() => setPage(page + 1)}
                  onPrev={() => setPage(page - 1)}
                  disabledPrev={page === 1}
                  disabledNext={page === totalPages}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default InvSeeProject;