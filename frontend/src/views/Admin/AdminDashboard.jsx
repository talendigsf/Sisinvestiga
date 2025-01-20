import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNav from "../../components/Admin/Common/NavAdmin";
import { getData, getDataParams } from "../../services/apiServices";
import "../../css/Admin/AdminDashboard.css";
import { Container,Row, Col, Tab, Tabs, Spinner } from "react-bootstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUsers, faUserCheck, faUserTimes, faProjectDiagram, faBook, faStar, faFolder, faUserTie, faUserCog, faFileAlt, faFileContract, faTasks, faBell, faChartBar, faCog, faListOl, faDesktop } from "@fortawesome/free-solid-svg-icons";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Tooltip as BSTooltip } from "react-bootstrap";
import AdmChartCard from '../../components/Admin/DashboardManagement/AdmChartCard';
import AdmEvaluationList from '../../components/Admin/DashboardManagement/AdmEvaluationList';
import AdmPendingEvaluationList from '../../components/Admin/DashboardManagement/AdmPendingEvaluationList';
import AdmQuickActionCard from '../../components/Admin/DashboardManagement/AdmQuickActionCard';
import AdmRequestList from '../../components/Admin/DashboardManagement/AdmRequestList';
import AdmStatCard from '../../components/Admin/DashboardManagement/AdmStatCard';

// Agregamos íconos a la biblioteca
ChartJS.register(ArcElement, Tooltip, Legend);

// Agregamos íconos a la biblioteca
library.add( faUsers, faUserCheck, faUserTimes, faProjectDiagram, faBook, faStar, faFolder, faUserTie, faUserCog, faFileAlt, faFileContract, faBell, faTasks, faChartBar, faCog, faListOl, faDesktop );

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: { total: 0, active: 0, inactive: 0, enabled: 0, disabled: 0 },
    projects: { total: 0, inProgress: 0, completed: 0, deleted: 0 },
    publications: { total: 0, published: 0, inReview: 0, deleted: 0 },
    evaluations: { total: 0, averageScore: 0, pendingProjects: 0 },
    requests: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      inProcess: 0,
    },
    activeSessions: 0,
  });
  const [recentEvaluations, setRecentEvaluations] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [pendingEvaluationProjects, setPendingEvaluationProjects] = useState(
    []
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const usersData = await getData("users");
      const projectsData = await getDataParams("projects", {
        includeDeleted: true,
        limit: 0,
      });
      const publicationsData = await getDataParams("publications", {
        includeDeleted: true,
        limit: 0,
      });
      const evaluationsData = await getDataParams("evaluations/all", {
        limit: 0,
      });
      const requestsData = await getDataParams("requests", { limit: 0 });

      // Estadísticas de usuarios
      const totalUsers = usersData.length;
      const activeUsers = usersData.filter(
        (user) => user.isVerified && !user.isDisabled
      ).length;
      const inactiveUsers = totalUsers - activeUsers;
      const enabledUsers = usersData.filter((user) => !user.isDisabled).length;
      const disabledUsers = usersData.filter((user) => user.isDisabled).length;

      // Sesiones activas
      const activeSessions = usersData.reduce(
        (total, user) => total + (user.sessions ? user.sessions.length : 0),
        0
      );

      // Estadísticas de evaluaciones
      const totalEvaluations = evaluationsData.evaluations.length;
      const totalScore = evaluationsData.evaluations.reduce(
        (sum, eva) => sum + eva.puntuacion,
        0
      );
      const averageScore =
        totalEvaluations > 0 ? (totalScore / totalEvaluations).toFixed(2) : 0;

      // Proyectos pendientes de evaluación
      const allProjects = projectsData.projects;
      const evaluatedProjectIds = evaluationsData.evaluations.map((eva) =>
        eva.project._id.toString()
      );
      const pendingProjects = allProjects.filter(
        (project) => !evaluatedProjectIds.includes(project._id.toString())
      );
      const pendingEvaluationCount = pendingProjects.length;

      // Estadísticas de solicitudes
      const totalRequests = requestsData.solicitudes.length;
      const pendingRequests = requestsData.solicitudes.filter(
        (req) => req.estado === "Pendiente"
      ).length;
      const approvedRequests = requestsData.solicitudes.filter(
        (req) => req.estado === "Aprobada"
      ).length;
      const rejectedRequests = requestsData.solicitudes.filter(
        (req) => req.estado === "Rechazada"
      ).length;
      const inProcessRequests = requestsData.solicitudes.filter(
        (req) => req.estado === "En Proceso"
      ).length;

      setStats({
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: inactiveUsers,
          enabled: enabledUsers,
          disabled: disabledUsers,
        },
        projects: {
          total: projectsData.total,
          inProgress: projectsData.projects.filter(
            (project) => project.estado === "En Proceso"
          ).length,
          completed: projectsData.projects.filter(
            (project) => project.estado === "Finalizado"
          ).length,
          deleted: projectsData.projects.filter((project) => project.isDeleted)
            .length,
        },
        publications: {
          total: publicationsData.total,
          published: publicationsData.publications.filter(
            (pub) => pub.estado === "Publicado"
          ).length,
          inReview: publicationsData.publications.filter(
            (pub) => pub.estado === "Revisado"
          ).length,
          deleted: publicationsData.publications.filter((pub) => pub.isDeleted)
            .length,
        },
        evaluations: {
          total: totalEvaluations,
          averageScore: averageScore,
          pendingProjects: pendingEvaluationCount,
        },
        requests: {
          total: totalRequests,
          pending: pendingRequests,
          approved: approvedRequests,
          rejected: rejectedRequests,
          inProcess: inProcessRequests,
        },
        activeSessions: activeSessions,
      });

      setPendingEvaluationProjects(pendingProjects.slice(0, 5)); // Mostrar los primeros 5

      setRecentEvaluations(evaluationsData.evaluations.slice(0, 5));
      setRecentRequests(requestsData.solicitudes.slice(0, 5));

      setLoading(false);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setLoading(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const createChartData = (data, labels, colors) => ({
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
      },
    ],
  });

  const userChartData = createChartData(
    [stats.users.active, stats.users.inactive, stats.users.disabled],
    ["Activos", "Inactivos", "Deshabilitados"],
    ["#36A2EB", "#FFCE56", "#FF6384"]
  );

  const projectChartData = createChartData(
    [
      stats.projects.inProgress,
      stats.projects.completed,
      stats.projects.deleted,
    ],
    ["En Proceso", "Completados", "Eliminados"],
    ["#FFCE56", "#4BC0C0", "#FF6384"]
  );

  const publicationChartData = createChartData(
    [
      stats.publications.published,
      stats.publications.inReview,
      stats.publications.deleted,
    ],
    ["Publicados", "Revisados", "Eliminados"],
    ["#4BC0C0", "#FFCE56", "#FF6384"]
  );

  const requestsChartData = createChartData(
    [
      stats.requests.pending,
      stats.requests.approved,
      stats.requests.rejected,
      stats.requests.inProcess,
    ],
    ["Pendientes", "Aprobadas", "Rechazadas", "En Proceso"],
    ["#FFCE56", "#4BC0C0", "#FF6384", "#36A2EB"]
  );

  const renderTooltip = (content) => (
    <BSTooltip id="button-tooltip">{content}</BSTooltip>
  );

  // Datos para las acciones rápidas
  const quickActions = [
    {
      title: "Gestión de Proyectos",
      description: "Administrar todos los proyectos en la plataforma.",
      icon: faFolder,
      buttonText: "Ir a Proyectos",
      path: "/admin/listarproyectos",
    },
    {
      title: "Gestión de Investigadores",
      description: "Administrar investigadores y su información.",
      icon: faUserTie,
      buttonText: "Ir a Investigadores",
      path: "/admin/gestionInvestigadores",
    },
    {
      title: "Gestión de Roles",
      description: "Administrar y actualizar los Roles del Proyecto.",
      icon: faUserCog,
      buttonText: "Ir a Roles",
      path: "/admin/roles",
    },
    {
      title: "Auditoría",
      description: "Revisar el historial de actividades.",
      icon: faFileAlt,
      buttonText: "Ir a Auditoría",
      path: "/admin/auditoria",
    },
    {
      title: "Publicaciones",
      description: "Administrar las publicaciones de los investigadores.",
      icon: faFileContract,
      buttonText: "Ir a Publicaciones",
      path: "/admin/publicaciones",
    },
    {
      title: "Solicitudes",
      description: "Solicitud para agregar investigadores a proyectos.",
      icon: faTasks,
      buttonText: "Ir a Solicitudes",
      path: "/admin/solicitudes",
    },
    {
      title: "Informes",
      description: "Generar y revisar informes de actividades.",
      icon: faChartBar,
      buttonText: "Ir a Informes",
      path: "/admin/informes",
    },
    {
      title: "Configuración de Perfil",
      description: "Administrar y actualizar la configuración del perfil.",
      icon: faCog,
      buttonText: "Ir a Configuración",
      path: "/admin/confprofile",
    },
    {
      title: "Gestión de Evaluaciones",
      description: "Administrar y actualizar las evaluaciones de los proyectos.",
      icon: faListOl,
      buttonText: "Ir a Evaluaciones",
      path: "/admin/evaluationprojects",
    },
    {
      title: "Centro de Notificaciones",
      description: "Administrar y actualizar las notificaciones del Sistema.",
      icon: faBell,
      buttonText: "Ir a Notificaciones",
      path: "/admin/notificaciones",
    },
  ];

  return (
    <div className="admin-dashboard">
      <AdminNav />
      <Container fluid className="py-4">
        <h1 className="dashboard-title mb-4">Panel de Administración</h1>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        ) : (
          <>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-4"
            >
              <Tab eventKey="overview" title="Resumen">
                <Row>
                  <Col md={4} lg={3}>
                    <AdmStatCard
                      title="Usuarios Totales"
                      icon={faUsers}
                      value={stats.users.total}
                      color="#36A2EB"
                    />
                    <AdmStatCard
                      title="Usuarios Activos"
                      icon={faUserCheck}
                      value={stats.users.active}
                      color="#36A2EB"
                    />
                  </Col>
                  <Col md={4} lg={3}>
                    <AdmStatCard
                      title="Proyectos Activos"
                      icon={faProjectDiagram}
                      value={stats.projects.inProgress}
                      color="#FFCE56"
                    />
                    <AdmStatCard
                      title="Usuarios Inactivos"
                      icon={faUserTimes}
                      value={stats.users.inactive}
                      color="#FFCE56"
                    />
                  </Col>
                  <Col md={4} lg={3}>
                    <AdmStatCard
                      title="Publicaciones"
                      icon={faBook}
                      value={stats.publications.total}
                      color="#4BC0C0"
                    />
                    <AdmStatCard
                      title="Sesiones Activas"
                      icon={faDesktop}
                      value={stats.activeSessions}
                      color="#8A2BE2"
                    />
                  </Col>
                  <Col md={4} lg={3}>
                    <AdmStatCard
                      title="Evaluaciones"
                      icon={faStar}
                      value={stats.evaluations.total}
                      color="#FF6384"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={6} lg={3}>
                    <AdmChartCard
                      title="Distribución de Usuarios"
                      data={userChartData}
                    />
                  </Col>
                  <Col md={6} lg={3}>
                    <AdmChartCard
                      title="Estado de Proyectos"
                      data={projectChartData}
                    />
                  </Col>
                  <Col md={6} lg={3}>
                    <AdmChartCard
                      title="Publicaciones"
                      data={publicationChartData}
                    />
                  </Col>
                  <Col md={6} lg={3}>
                    <AdmChartCard
                      title="Solicitudes"
                      data={requestsChartData}
                    />
                  </Col>
                </Row>
              </Tab>
              <Tab eventKey="evaluations" title="Evaluaciones Recientes">
                <AdmEvaluationList
                  evaluations={recentEvaluations}
                  handleNavigation={handleNavigation}
                  renderTooltip={renderTooltip}
                />
              </Tab>
              <Tab
                eventKey="pendingEvaluations"
                title="Proyectos Pendientes de Evaluación"
              >
                <AdmPendingEvaluationList projects={pendingEvaluationProjects} />
              </Tab>
              <Tab eventKey="requests" title="Solicitudes Recientes">
                <AdmRequestList
                  requests={recentRequests}
                  handleNavigation={handleNavigation}
                  renderTooltip={renderTooltip}
                />
              </Tab>
            </Tabs>
          </>
        )}

        <Row className="mt-4">
          <Col>
            <h2 className="section-title">Acciones Rápidas</h2>
          </Col>
        </Row>
        <Row>
          {quickActions.map((action, index) => (
            <Col md={4} lg={3} key={index}>
              <AdmQuickActionCard {...action} handleNavigation={handleNavigation} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;