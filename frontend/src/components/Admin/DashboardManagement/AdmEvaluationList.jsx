import React from "react";
import {
  Card,
  ListGroup,
  Badge,
  Button,
  OverlayTrigger,
} from "react-bootstrap";

const AdmEvaluationList = ({
  evaluations,
  handleNavigation,
  renderTooltip,
}) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Recent Evaluations</Card.Title>
        <ListGroup variant="flush">
          {evaluations.map((evaluation) => (
            <ListGroup.Item
              key={evaluation._id}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{evaluation.project.nombre}</strong>
                <p className="mb-0 text-muted">
                    Evaluator: {evaluation.evaluator.nombre}{" "}
                  {evaluation.evaluator.apellido}
                </p>
              </div>
              <div>
                <Badge bg="primary" pill>
                  {evaluation.puntuacion}
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
                      handleNavigation(
                        `/admin/evaluationprojects/${evaluation.project._id}`
                      )
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

export default AdmEvaluationList;
