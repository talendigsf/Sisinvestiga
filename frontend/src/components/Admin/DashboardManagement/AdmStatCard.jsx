import React from "react";
import { Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AdmStatCard = ({ title, icon, value, color }) => {
  return (
    <Card className="stat-card mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted mb-2">{title}</h6>
            <h3 className="mb-0">{value}</h3>
          </div>
          <FontAwesomeIcon icon={icon} size="2x" color={color} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default AdmStatCard;
