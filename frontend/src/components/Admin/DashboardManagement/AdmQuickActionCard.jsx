import React from "react";
import { Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AdmQuickActionCard = ({
  title,
  description,
  icon,
  buttonText,
  path,
  handleNavigation,
}) => {
  return (
    <Card className="dashboard-card">
      <Card.Body>
        <Card.Title>
          <FontAwesomeIcon icon={icon} className="me-2" /> {title}
        </Card.Title>
        <Card.Text>{description}</Card.Text>
        <Button
          variant="primary"
          onClick={() => handleNavigation(path)}
          className="w-100"
        >
          <FontAwesomeIcon icon={icon} className="me-2" /> {buttonText}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default AdmQuickActionCard;
