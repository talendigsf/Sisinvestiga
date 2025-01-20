import React from "react";
import {
  Card,
  ListGroup,
  Badge,
  Button,
  OverlayTrigger,
} from "react-bootstrap";

const AdmRequestList = ({ requests, handleNavigation, renderTooltip }) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Recent Requests</Card.Title>
        <ListGroup variant="flush">
          {requests.map((request) => (
            <ListGroup.Item
              key={request._id}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{request.tipoSolicitud}</strong>
                <p className="mb-0 text-muted">
                  Applicant: {request.solicitante.nombre}{" "}
                  {request.solicitante.apellido}
                </p>
              </div>
              <div>
                <Badge
                  bg={
                    request.estado === "Pendiente"
                      ? "warning"
                      : request.estado === "Aprobada"
                      ? "success"
                      : request.estado === "Rechazada"
                      ? "danger"
                      : "info"
                  }
                  pill
                >
                  {request.estado}
                </Badge>
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip("Ver detalles")}
                >
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() =>
                      handleNavigation(`/admin/solicitudes/${request._id}`)
                    }
                  >
                    Details
                  </Button>
                </OverlayTrigger>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default AdmRequestList;
