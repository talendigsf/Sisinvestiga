import React from "react";
import { Card } from "react-bootstrap";
import { Pie } from "react-chartjs-2";

const AdmChartCard = ({ title, data }) => {
  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <div className="chart-container">
          <Pie
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </Card.Body>
    </Card>
  );
};

export default AdmChartCard;
