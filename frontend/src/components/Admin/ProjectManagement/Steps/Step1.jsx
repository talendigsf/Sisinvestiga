import React from 'react';
import { Form } from 'react-bootstrap';

const Step1 = ({ formData, handleChange }) => {
  const { nombre, descripcion, objetivos } = formData;

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Project Name</Form.Label>
        <Form.Control
          type="text"
          name="nombre"
          value={nombre}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="descripcion"
          value={descripcion}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Objectives</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="objetivos"
          value={objetivos}
          onChange={handleChange}
        />
      </Form.Group>
    </>
  );
};

export default Step1;