import React, { useState, useEffect } from "react";
import {
  FaFolder,
  FaFileAlt,
  FaTasks,
  FaChartPie,
  FaTable,
  FaClock,
} from "react-icons/fa";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { getUserData } from "../../../services/apiServices";
import "../../../css/Investigator/DashboardContent.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardContent = () => {
  const [projects, setProjects] = useState([]);
  const [publications, setPublications] = useState([]);
  const [totalPublications, setTotalPublications] = useState(0);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("projects");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const proyectos = await getUserData("projects");
        setProjects(proyectos.data || []);

        const publicaciones = await getUserData("publications");
        setPublications(publicaciones.publications || []);
        setTotalPublications(publicaciones.total || 0);

        const solicitudes = await getUserData("requests");
        setRequests(solicitudes.solicitudes || []);
      } catch (error) {
        setError("Error al cargar los datos del dashboard");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Cargando datos...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const projectData = {
    labels: ["Planeado", "En Proceso", "Finalizado", "Cancelado"],
    datasets: [
      {
        label: "Proyectos",
        data: [
          projects.filter((p) => p.estado === "Planeado").length,
          projects.filter((p) => p.estado === "En Proceso").length,
          projects.filter((p) => p.estado === "Finalizado").length,
          projects.filter((p) => p.estado === "Cancelado").length,
        ],
        backgroundColor: ["#4caf50", "#ff9800", "#03a9f4", "#f44336"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard-content container-fluid">
      <h1 className="dashboard-title">Panel de Control del Investigador</h1>

      <div className="row summary-cards">
        <div className="col-md-4">
          <div className="card summary-card">
            <div className="card-body">
              <h5 className="card-title">
                <FaFolder className="icon" /> Proyectos Activos
              </h5>
              <p className="card-text">
                {projects.filter((p) => p.estado === "En Proceso").length || 0}
              </p>
              <p className="card-subtext">
                +{projects.filter((p) => p.estado === "Planeado").length}{" "}
                planeados
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card summary-card">
            <div className="card-body">
              <h5 className="card-title">
                <FaFileAlt className="icon" /> Publicaciones Totales
              </h5>
              <p className="card-text">{totalPublications}</p>
              <p className="card-subtext">
                +{publications.filter((p) => p.estado === "Borrador").length} en
                borrador
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card summary-card">
            <div className="card-body">
              <h5 className="card-title">
                <FaTasks className="icon" /> Solicitudes Pendientes
              </h5>
              <p className="card-text">
                {requests.filter((r) => r.estado === "Pendiente").length || 0}
              </p>
              <p className="card-subtext">
                +{requests.filter((r) => r.estado === "En Revisión").length} en
                revisión
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="summary-card-header">
          <ul className="nav nav-tabs summary-card-header-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "projects" ? "active" : ""
                }`}
                onClick={() => setActiveTab("projects")}
              >
                <FaChartPie className="tab-icon" /> Proyectos
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "publications" ? "active" : ""
                }`}
                onClick={() => setActiveTab("publications")}
              >
                <FaTable className="tab-icon" /> Publicaciones
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "requests" ? "active" : ""
                }`}
                onClick={() => setActiveTab("requests")}
              >
                <FaClock className="tab-icon" /> Solicitudes
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {activeTab === "projects" && (
            <div>
              <h5 className="card-title">Estado de Proyectos</h5>
              <p className="card-text">Distribución de proyectos por estado</p>
              {projects.length > 0 ? (
                <div className="chart-container">
                  <Doughnut
                    data={projectData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <p className="text-center">No hay proyectos para mostrar</p>
              )}
            </div>
          )}
          {activeTab === "publications" && (
            <div>
              <h5 className="card-title">Publicaciones Recientes</h5>
              <p className="card-text">Últimas 5 publicaciones registradas</p>
              {publications.length > 0 ? (
                <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Revista</th>
                      <th>Estado</th>
                      <th>Proyecto Asociado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publications.slice(0, 5).map((publication, index) => (
                      <tr key={index}>
                        <td>{publication.titulo}</td>
                        <td>{publication.revista}</td>
                        <td>
                          <span
                            className={`badge bg-${
                              publication.estado === "Publicado" ? "success" : "warning"
                            }`}
                          >
                            {publication.estado}
                          </span>
                        </td>
                        <td>
                          {publication.proyecto ? publication.proyecto.nombre : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              ) : (
                <p className="text-center">No hay publicaciones recientes</p>
              )}
            </div>
          )}
          {activeTab === "requests" && (
            <div>
              <h5 className="card-title">Solicitudes Recientes</h5>
              <p className="card-text">Últimas 5 solicitudes registradas</p>
              {requests.length > 0 ? (
                <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo de Solicitud</th>
                      <th>Estado</th>
                      <th>Proyecto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.slice(0, 5).map((request) => (
                      <tr key={request._id}>
                        <td>
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td>{request.tipoSolicitud}</td>
                        <td>
                          <span
                            className={`badge bg-${
                              request.estado === "Pendiente" ? "warning" : "info"
                            }`}
                          >
                            {request.estado}
                          </span>
                        </td>
                        <td>
                          {request.proyecto ? request.proyecto.nombre : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              ) : (
                <p className="text-center">No hay solicitudes recientes</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
