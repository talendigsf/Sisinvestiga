import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Card,
  Button,
  Badge,
  Spinner,
} from "react-bootstrap";
import { getDataParams } from "../../../services/apiServices";
import AlertComponent from "../../Common/AlertComponent";
import "../../../css/Admin/AdmSeeAudits.css";
import AdmPagination from '../Common/AdmPagination';
import { FaSearch, FaSync } from 'react-icons/fa';

const AdmSeeAudits = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    user: "",
    activity: "",
    method: "",
    startDate: "",
    endDate: "",
  });

  const [stats, setStats] = useState({
    totalLogs: 0,
    uniqueUsers: 0,
    mostCommonActivity: "",
  });

  const fetchAuditLogs = useCallback(async () => {
    setLoading(true);
    try {
      const formattedFilters = {
        ...filters,
        startDate: filters.startDate ? new Date(filters.startDate).toISOString() : '',
        endDate: filters.endDate ? new Date(filters.endDate).toISOString() : '',
      };

      const response = await getDataParams('audits', {
        ...formattedFilters,
        page: currentPage,
        limit: 10,
      });
      setAuditLogs(response.logs);
      setTotalPages(response.totalPages);
      updateStats(response);
    } catch (error) {
      AlertComponent.error('Error loading audit records');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const updateStats = (data) => {
    const uniqueUsers = new Set(data.logs.map((log) => log.user?._id)).size;
    const activityCount = data.logs.reduce((acc, log) => {
      acc[log.activity] = (acc[log.activity] || 0) + 1;
      return acc;
    }, {});
    const mostCommonActivity =
      Object.entries(activityCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "";

    setStats({
      totalLogs: data.total,
      uniqueUsers,
      mostCommonActivity,
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const resetFilters = () => {
    setFilters({
      user: "",
      activity: "",
      method: "",
      startDate: "",
      endDate: "",
    });
    setCurrentPage(1);
  };

  const getMethodBadgeVariant = (method) => {
    switch (method) {
      // case 'GET': return 'success';
      case 'POST': return 'primary';
      case 'PUT': return 'warning';
      case 'PATCH': return 'info';
      case 'DELETE': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <Container fluid className="audit-container">
      <h1 className="text-center mb-4">Audit Records</h1>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="stats-card">
            <Card.Body>
              <Card.Title>Total Logs</Card.Title>
              <Card.Text>{stats.totalLogs}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stats-card">
            <Card.Body>
              <Card.Title>Unique Users</Card.Title>
              <Card.Text>{stats.uniqueUsers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stats-card">
            <Card.Body>
              <Card.Title>Most Common Activity</Card.Title>
              <Card.Text>{stats.mostCommonActivity}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Form>
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>User</Form.Label>
                  <Form.Control
                    type="text"
                    name="user"
                    value={filters.user}
                    onChange={handleFilterChange}
                    placeholder="Filtrar por usuario"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Activity</Form.Label>
                  <Form.Control
                    type="text"
                    name="activity"
                    value={filters.activity}
                    onChange={handleFilterChange}
                    placeholder="Filtrar por actividad"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Method</Form.Label>
                  <Form.Control
                    as="select"
                    name="method"
                    value={filters.method}
                    onChange={handleFilterChange}
                  >
                    <option value="">All</option>
                    {/* <option value="GET">GET</option> */}
                    <option value="PATCH">PATCH</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <Button variant="primary" onClick={fetchAuditLogs}>
                  <FaSearch className="me-2" />
                  Search
                </Button>
                <Button variant="secondary" onClick={resetFilters} className="ms-2">
                  <FaSync className="me-2" />
                  Reset Filters
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <Table striped bordered hover className="audit-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Method</th>
                  <th>URL</th>
                  <th>Activity</th>
                  <th>IP</th>
                  <th>Location</th>
                  <th>Device</th>
                  <th>Date and Time</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log._id}>
                    <td>
                      {log.user ? `${log.user.nombre} ${log.user.apellido}` : 'Unknown User'}
                    </td>
                    <td>
                      {log.user ? `${log.user.email}` : 'N/A'}
                    </td>
                    <td>
                      {log.user && log.user.role ? log.user.role.roleName : 'N/A'}
                    </td>
                    <td>
                      <Badge bg={getMethodBadgeVariant(log.method)}>{log.method}</Badge>
                    </td>
                    <td className="text-truncate" style={{maxWidth: '200px'}}>{log.url}</td>
                    <td>{log.activity}</td>
                    <td>{log.ipAddress}</td>
                    <td>{log.location}</td>
                    <td>{log.device}</td>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {totalPages > 1 && (
            <AdmPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default AdmSeeAudits;