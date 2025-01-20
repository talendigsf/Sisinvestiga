import React from 'react';
import { Card } from 'react-bootstrap';
import InvestigadorItem from './InvestigatorItem';

const Step4 = ({
  investigadoresDisponibles,
  investigadoresSeleccionados,
  handleInvestigadorChange,
}) => {
  return (
    <Card className="mb-3">
      <Card.Header>Researchers</Card.Header>
      <Card.Body>
        {investigadoresDisponibles.map((investigador) => (
          <InvestigadorItem
            key={investigador._id}
            investigador={investigador}
            isSelected={investigadoresSeleccionados.includes(investigador._id)}
            handleInvestigadorChange={handleInvestigadorChange}
          />
        ))}
      </Card.Body>
    </Card>
  );
};

export default Step4;