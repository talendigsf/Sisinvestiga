import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Spinner, Alert, Pagination } from 'react-bootstrap';
import { FaCheckCircle, FaTrashAlt, FaFilter, FaSync } from 'react-icons/fa';
import { getUserData, postData, putData, deleteData } from '../../../services/apiServices';
import { useNotifications } from '../../../Context/NotificationsProvider';
import AlertComponent from '../../Common/AlertComponent';
import '../../../css/Investigator/InvNotificationCenter.css';

const InvNotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    type: '',
    isRead: '',
  });

  const { fetchNotifications } = useNotifications();

  const fetchUserNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        type: filters.type || undefined,
        isRead: filters.isRead || undefined,
      };

      const response = await getUserData('notifications', params);
      setNotifications(response.notifications);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      console.error("Error al obtener las notificaciones", err);
      setError('Error al cargar las notificaciones. Por favor, intente de nuevo.');
      AlertComponent.error('Error al cargar las notificaciones');
    }
    setLoading(false);
  }, [currentPage, filters]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUserNotifications();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchUserNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await putData(`notifications/${id}`, 'read');
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
      await fetchNotifications();
      AlertComponent.success('Notificación marcada como leída');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      AlertComponent.error('Error al marcar la notificación como leída');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteData('notifications', id);
      setNotifications(notifications.filter(n => n._id !== id));
      await fetchNotifications();
      AlertComponent.success('Notificación eliminada con éxito');
    } catch (error) {
      console.error('Error deleting notification:', error);
      AlertComponent.error('Error al eliminar la notificación');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await postData('notifications/readall');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      await fetchNotifications();
      AlertComponent.success('Todas las notificaciones marcadas como leídas');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      AlertComponent.error('Error al marcar todas las notificaciones como leídas');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
          {number}
        </Pagination.Item>,
      );
    }
    return <Pagination>{items}</Pagination>;
  };

  return (
    <Container className="notification-center mt-4">
      <h1 className="text-center mb-4">Centro de Notificaciones</h1>
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label><FaFilter /> Filtrar por Tipo</Form.Label>
            <Form.Control
              as="select"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">Todos</option>
              <option value="Proyecto">Proyecto</option>
              <option value="Publicación">Publicación</option>
              <option value="Solicitud">Solicitud</option>
              <option value="Usuario">Usuario</option>
              <option value="Evaluacion">Evaluación</option>
              <option value="Rol">Rol</option>
              <option value="Otro">Otro</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label><FaFilter /> Filtrar por Estado</Form.Label>
            <Form.Control
              as="select"
              name="isRead"
              value={filters.isRead}
              onChange={handleFilterChange}
            >
              <option value="">Todos</option>
              <option value="false">No leídos</option>
              <option value="true">Leídos</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={4} className="d-flex align-items-end">
          <Button variant="secondary" onClick={fetchUserNotifications} className="me-2">
            <FaSync /> Actualizar
          </Button>
          <Button variant="primary" onClick={handleMarkAllAsRead}>
            <FaCheckCircle /> Marcar todas como leídas
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : notifications.length === 0 ? (
        <Alert variant="info">No hay notificaciones que mostrar.</Alert>
      ) : (
        <Row>
          {notifications.map((notification) => (
            <Col md={6} lg={4} key={notification._id} className="mb-3">
              <Card className={`notification-card ${notification.isRead ? 'read' : 'unread'}`}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Badge bg={notification.isRead ? 'secondary' : 'primary'}>
                      {notification.isRead ? 'Leído' : 'No leído'}
                    </Badge>
                    <Badge bg="info">{notification.type}</Badge>
                  </div>
                  <Card.Title>{notification.message}</Card.Title>
                  <Card.Text>
                    <small className="text-muted">
                      {new Date(notification.createdAt).toLocaleString()}
                    </small>
                  </Card.Text>
                  <div className="d-flex justify-content-between">
                    {!notification.isRead && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification._id)}
                      >
                        <FaCheckCircle /> Marcar como leída
                      </Button>
                    )}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(notification._id)}
                    >
                      <FaTrashAlt /> Eliminar
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <div className="d-flex justify-content-center mt-4">
        {renderPagination()}
      </div>
    </Container>
  );
};

export default InvNotificationCenter;