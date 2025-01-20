import React from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { FaTrash, FaPlus } from 'react-icons/fa';

const HitosSection = ({ hitos, addHito, removeHito, handleHitoChange }) => (
  <Card className="mb-3">
    <Card.Header>Milestone</Card.Header>
    <Card.Body>
      {hitos.map((hito, index) => (
        <Row key={index} className="mb-3">
          <Col xs={12} md={6}>
            <Form.Control
              type="text"
              placeholder="Milestone name"
              value={hito.nombre}
              onChange={(e) => handleHitoChange(index, "nombre", e.target.value)}
              required
            />
          </Col>
          <Col xs={10} md={5}>
            <DatePicker
              selected={hito.fecha}
              onChange={(date) => handleHitoChange(index, "fecha", date)}
              className="form-control"
              dateFormat="dd/MM/yyyy"
              required
            />
          </Col>
          <Col xs={2} md={1}>
            <Button variant="danger" onClick={() => removeHito(index)}>
              <FaTrash />
            </Button>
          </Col>
        </Row>
      ))}
      <Button variant="success" onClick={addHito}>
        <FaPlus /> Add Milestone
      </Button>
    </Card.Body>
  </Card>
);

export default HitosSection;