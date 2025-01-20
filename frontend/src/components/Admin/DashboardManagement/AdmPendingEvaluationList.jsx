import React from "react";
import { Card, ListGroup } from "react-bootstrap";

const AdmPendingEvaluationList = ({ projects }) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Projects Pending Evaluation</Card.Title>
        <ListGroup variant="flush">
          {projects.map((project) => (
            <ListGroup.Item key={project._id}>
              <div>
                <strong>{project.nombre}</strong>
                <p className="mb-0 text-muted">{project.descripcion}</p>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default AdmPendingEvaluationList;
