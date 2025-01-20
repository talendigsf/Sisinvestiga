import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Table, Button, Form, Pagination, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaTrash, FaUndo, FaCheck } from 'react-icons/fa';
import { getDataParams, putData, deleteData } from '../../../services/apiServices';
import { useNotifications } from '../../../Context/NotificationsProvider';
import '../../../css/Admin/AdmSeeNotifications.css';

const AdmSeeNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    type: '',
    isRead: '',
    isDeleted: '',
  });

  const { fetchNotifications } = useNotifications();

  const fetchNotificationsAdm = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        type: filters.type || undefined,
        isRead: filters.isRead || undefined,
        isDeleted: filters.isDeleted || undefined,
      };
      const response = await getDataParams('notifications/admin/all', params);

      setNotifications(response.notifications);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (error) {
      setError("Error loading notifications. Please try again.");
    }
    setLoading(false);
  }, [currentPage, filters]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchNotificationsAdm();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchNotificationsAdm]);

  const handleMarkAsRead = async (id) => {
    try {
      await putData(`notifications/${id}`, 'read');
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
      await fetchNotifications();
    } catch (error) {
      setError('Failed to mark notification as read. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteData('notifications', id);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isDeleted: true } : n
      ));
      await fetchNotifications();
    } catch (error) {
      setError('Failed to mark notification as read. Please try again.');
    }
  };

  const handleRestore = async (id) => {
    try {
      await putData(`notifications/${id}`, 'restore');
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isDeleted: false } : n
      ));
      await fetchNotifications();
    } catch (error) {
      console.error('Error restoring notification:', error);
      setError('Failed to mark notification as read. Please try again.');
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
    <Container fluid className="notification-management">
      <h1 className="my-4">Notification Management</h1>
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Type</Form.Label>
            <Form.Control as="select" name="type" onChange={handleFilterChange} value={filters.type}>
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
            <Form.Label>Read Status</Form.Label>
            <Form.Control as="select" name="isRead" onChange={handleFilterChange} value={filters.isRead}>
              <option value="">All</option>
              <option value="true">Read</option>
              <option value="false">Unread</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Deletion Status</Form.Label>
            <Form.Control as="select" name="isDeleted" onChange={handleFilterChange} value={filters.isDeleted}>
              <option value="">All</option>
              <option value="false">Active</option>
              <option value="true">Deleted</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {notifications.length === 0 ? (
            <Alert variant="info">No notifications found.</Alert>
          ) : (
            <Table responsive hover className="notification-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Message</th>
                  <th>Creation Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notification) => (
                  <tr key={notification._id} className={notification.isDeleted ? 'table-danger' : ''}>
                    <td>{notification.type}</td>
                    <td>{notification.message}</td>
                    <td>{new Date(notification.createdAt).toLocaleString()}</td>
                    <td>
                      {notification.isRead ? (
                        <Badge bg="success">Read</Badge>
                      ) : (
                        <Badge bg="warning">Unread</Badge>
                      )}
                    </td>
                    <td>
                      {!notification.isRead && (
                        <Button variant="outline-success" size="sm" onClick={() => handleMarkAsRead(notification._id)} className="me-2">
                          <FaCheck /> Mark as Read
                        </Button>
                      )}
                      {!notification.isDeleted ? (
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(notification._id)}>
                          <FaTrash /> Delete
                        </Button>
                      ) : (
                        <Button variant="outline-warning" size="sm" onClick={() => handleRestore(notification._id)}>
                          <FaUndo /> Restore
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          <div className="d-flex justify-content-center">
            {renderPagination()}
          </div>
        </>
      )}
    </Container>
  );
}

export default AdmSeeNotifications