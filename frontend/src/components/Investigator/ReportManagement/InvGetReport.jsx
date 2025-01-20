import React, { useState, useEffect, useCallback } from "react";
import { FaFileCsv, FaFilePdf, FaSpinner } from "react-icons/fa";
import NavInvestigator from "../Common/NavInvestigator";
import AlertComponent from "../../Common/AlertComponent";
import { getUserData, getFiles, getData } from "../../../services/apiServices";
import Pagination from "../../../components/Common/Pagination";
import SearchBar from "../../../components/Common/SearchBar";
import "../../../css/Investigator/InvReportView.css";

const InvGetReport = () => {
  const [loading, setLoading] = useState(true);
  const [projectsData, setProjectsData] = useState([]);
  const [evaluationsData, setEvaluationsData] = useState([]);
  const [activeTab, setActiveTab] = useState("projects");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "projects") {
        const response = await getUserData("projects", { page, limit: 10, search: searchTerm });
        if (response && response.data) {
          setProjectsData(response.data);
          setTotalPages(Math.ceil(response.total / response.limit));
        } else {
          setProjectsData([]);
          setTotalPages(1);
        }
      } else if (selectedProject) {
        const response = await getData(`evaluations/projects/${selectedProject}`);
        setEvaluationsData(response);
      }
    } catch (error) {
      console.error(`Error al cargar los ${activeTab}:`, error);
      AlertComponent.error(`Error al cargar los ${activeTab}. Por favor, inténtelo de nuevo.`);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, searchTerm, selectedProject]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchProjectEvaluations = useCallback(async (projectId) => {
    setLoading(true);
    try {
      const response = await getData(`evaluations/projects/${projectId}`);
      setEvaluationsData(response);
      setSelectedProject(projectId);
      setActiveTab("evaluations");
    } catch (error) {
      console.error('Error fetching project evaluations:', error);
      AlertComponent.error('Error al cargar las evaluaciones del proyecto. Por favor, inténtelo de nuevo.');
    } finally {
      setLoading(false);
    }
  }, []);

  const generateReport = async (type, format) => {
    setLoading(true);
    try {
      // Ajustar las rutas según los nuevos endpoints
      const reportType = activeTab === "projects" ? "projects" : "evaluations";
      const response = await getFiles(`reports/investigator/${reportType}/${format}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: format === "csv" ? "text/csv" : "application/pdf",
        })
      );
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers["content-disposition"];
      let filename = `${reportType}_report.${format}`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      AlertComponent.success(
        `Informe de ${reportType} en formato ${format.toUpperCase()} generado con éxito.`
      );
    } catch (error) {
      console.error("Error al generar el informe:", error);
      AlertComponent.error("Error al generar el informe. Por favor, inténtelo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') {
      if (value instanceof Date) return value.toLocaleDateString();
      if (Array.isArray(value)) return value.map(v => formatValue(v)).join(', ');
      return JSON.stringify(value);
    }
    return String(value);
  };

  const renderTable = (data) => {
    if (data.length === 0) return <p className="no-data-message">No hay datos disponibles.</p>;

    if (activeTab === "projects") {
      return (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((project) => (
                <tr key={project._id}>
                  <td>{project.nombre}</td>
                  <td>{project.descripcion}</td>
                  <td>
                    <span className={`badge bg-${
                      project.estado === 'Finalizado' ? 'success' :
                      project.estado === 'Cancelado' ? 'danger' :
                      project.estado === 'En Proceso' ? 'warning' : 
                      project.estado === 'Planeado' ? 'info' : 'secondary'
                    }`}>
                      {project.estado}
                    </span>
                  </td>
                  <td>{formatValue(project.cronograma.fechaInicio)}</td>
                  <td>{formatValue(project.cronograma.fechaFin)}</td>
                  <td>
                    <button onClick={() => fetchProjectEvaluations(project._id)} className="btn btn-success btn-sm">
                      Ver Evaluaciones
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return (
        <div className="row">
          {data.map((evaluation) => (
            <div key={evaluation._id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{evaluation.evaluator.nombre} {evaluation.evaluator.apellido}</h5>
                  <div className="d-flex align-items-center mb-2">
                    <span className="ml-2">Puntuacion: {evaluation.puntuacion.toFixed(1)}</span>
                  </div>
                  <p className="card-text">Email: {evaluation.evaluator.email}</p>
                  <p className="card-text">{evaluation.comentarios}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <>
      <NavInvestigator />
      <div className="container mt-4">
        <h1 className="text-center mb-4">Generación de Informes</h1>

        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "projects" ? "active" : ""}`}
              onClick={() => {setActiveTab("projects"); setPage(1); setSearchTerm(""); setSelectedProject(null);}}
            >
              Proyectos
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "evaluations" ? "active" : ""}`}
              onClick={() => {setActiveTab("evaluations"); setSearchTerm(""); }}
              disabled={!selectedProject}
            >
              Evaluaciones
            </button>
          </li>
        </ul>

        {activeTab === "projects" && (
          <SearchBar
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Buscar proyectos..."
          />
        )}

        <div className="mt-4">
          {loading ? (
            <div className="text-center">
              <FaSpinner className="spinner-border" role="status" />
              <p>Cargando datos...</p>
            </div>
          ) : (
            <>
              <h2>{activeTab === "projects" ? "Vista Previa de Proyectos" : "Evaluaciones del Proyecto"}</h2>
              {renderTable(activeTab === "projects" ? projectsData : evaluationsData)}
              <div className="mt-4 d-flex justify-content-end">
                <button
                  onClick={() => generateReport(activeTab === "projects" ? "projects" : "investigators", "csv")}
                  className="btn btn-success me-2"
                  disabled={loading}
                >
                  <FaFileCsv className="me-2" />
                  {loading ? "Generando..." : "Descargar CSV"}
                </button>
                <button
                  onClick={() => generateReport(activeTab === "projects" ? "projects" : "investigators", "pdf")}
                  className="btn btn-danger"
                  disabled={loading}
                >
                  <FaFilePdf className="me-2" />
                  {loading ? "Generando..." : "Descargar PDF"}
                </button>
              </div>
            </>
          )}
        </div>

        {activeTab === "projects" && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onNext={() => setPage(page + 1)}
            onPrev={() => setPage(page - 1)}
            disabledPrev={page === 1}
            disabledNext={page === totalPages}
          />
        )}
      </div>
    </>
  );
};

export default InvGetReport;