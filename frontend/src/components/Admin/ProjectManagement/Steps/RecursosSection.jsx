import React from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import { FaTrash, FaPlus } from 'react-icons/fa';

const RecursosSection = ({ recursos, addRecurso, removeRecurso, handleRecursoChange }) => (
  <Card>
    <Card.Header>Resources</Card.Header>
    <Card.Body>
      {recursos.map((recurso, index) => (
        <Row key={index} className="mb-3">
          <Col xs={10}>
            <Form.Control
              type="text"
              placeholder="Resource"
              value={recurso}
              onChange={(e) => handleRecursoChange(index, e.target.value)}
              required
            />
          </Col>
          <Col xs={2}>
            <Button variant="danger" onClick={() => removeRecurso(index)}>
              <FaTrash />
            </Button>
          </Col>
        </Row>
      ))}
      <Button variant="success" onClick={addRecurso}>
        <FaPlus /> Add Resource
      </Button>
    </Card.Body>
  </Card>
);

export default RecursosSection;