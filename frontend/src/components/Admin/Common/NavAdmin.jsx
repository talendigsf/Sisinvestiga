import React, { useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentRole,
  logoutUser,
} from "../../../features/auth/authSlice";
import { postData, putData, deleteData } from "../../../services/apiServices";
import { useNotifications } from "../../../Context/NotificationsProvider";
import "../../../css/Admin/NavAdmin.css";
import logo from "../../../assets/img/LogoWebUCSD.png";
import {
  FaHome,
  FaFolder,
  FaUsers,
  FaUserCog,
  FaFileAlt,
  FaBook,
  FaTasks,
  FaChartBar,
  FaCog,
  FaClipboardList,
  FaSignOutAlt,
  FaArrowLeft,
  FaBars
} from "react-icons/fa";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import NotificationsDropdown from "./NotificationsDropdown";

const AdminNav = () => {
  const role = useSelector(selectCurrentRole);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { notifications, unreadCount, fetchNotifications, removeNotification } =
    useNotifications();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("An error occurred during the logout process.");
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await putData(`notifications/${id}`, "read");
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleUnMarkAsRead = async (id) => {
    try {
      await putData(`notifications/${id}`, "unread");
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as not read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await postData("notifications/readall");
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleUnMarkAllAsRead = async () => {
    try {
      await postData("notifications/unreadall");
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking all notifications as not read:", error);
    }
  };

  const handleDeleteNotification = useCallback(
    async (id) => {
      try {
        await deleteData("notifications", id);
        removeNotification(id);
      } catch (error) {
        console.error("Error deleting notification:", error);
      }
    },
    [removeNotification]
  );

  const menuItems = [
    { path: "/admin", icon: <FaHome />, text: "Admin Panel" },
    {
      path: "/admin/listarproyectos",
      icon: <FaFolder />,
      text: "Project Management",
    },
    {
      path: "/admin/gestionInvestigadores",
      icon: <FaUsers />,
      text: "Researcher Management",
    },
    { path: "/admin/roles", icon: <FaUserCog />, text: "Role Management" },
    { path: "/admin/auditoria", icon: <FaFileAlt />, text: "Audit" },
    { path: "/admin/publicaciones", icon: <FaBook />, text: "Publications" },
    { path: "/admin/solicitudes", icon: <FaTasks />, text: "Requests" },
    { path: "/admin/informes", icon: <FaChartBar />, text: "Reports" },
    {
      path: "/admin/confprofile",
      icon: <FaCog />,
      text: "Profile Settings",
    },
    {
      path: "/admin/evaluationprojects",
      icon: <FaClipboardList />,
      text: "Evaluation Management",
    },
  ];

  const renderTooltip = (props, text) => (
    <Tooltip
      id={`tooltip-${text.replace(/\s+/g, "-").toLowerCase()}`}
      {...props}
    >
      {text}
    </Tooltip>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-admin">
      <div className="container-fluid">
        <Link to="/admin" className="navbar-brand">
          <img src={logo} alt="UCSD Logo" className="nav-logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <FaBars />
        </button>
        <div
          className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {role === "Administrador" &&
              menuItems.map((item, index) => (
                <li className="nav-item" key={index}>
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={(props) => renderTooltip(props, item.text)}
                  >
                    <Link
                      to={item.path}
                      className={`nav-link ${
                        location.pathname === item.path ? "active" : ""
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      <span className="d-lg-none ms-2">{item.text}</span>
                    </Link>
                  </OverlayTrigger>
                </li>
              ))}
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item">             
            <NotificationsDropdown
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAsRead={handleMarkAsRead}
                onMarkAsUnread={handleUnMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onMarkAllAsUnread={handleUnMarkAllAsRead}
                onDelete={handleDeleteNotification}
              />
            </li>
            <li className="nav-item">
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={(props) => renderTooltip(props, "Logout")}
              >
                <button
                  onClick={handleLogout}
                  className="nav-link btn btn-link"
                >
                  <FaSignOutAlt />
                  <span className="d-lg-none ms-2">Logout</span>
                </button>
              </OverlayTrigger>
            </li>
            <li className="nav-item">
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={(props) => renderTooltip(props, "Back")}
              >
                <button onClick={goBack} className="nav-link btn btn-link">
                  <FaArrowLeft />
                  <span className="d-lg-none ms-2">Back</span>
                </button>
              </OverlayTrigger>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;
