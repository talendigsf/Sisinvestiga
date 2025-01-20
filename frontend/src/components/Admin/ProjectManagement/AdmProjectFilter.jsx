import React, { useState } from 'react';
import { Form, Row, Col, InputGroup } from 'react-bootstrap';
import { FaSearch, FaFilter } from 'react-icons/fa';

const AdmProjectFilter = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('Todos');

  const estados = ['Todos', 'Planeado', 'En Proceso', 'Finalizado', 'Cancelado', 'Eliminado'];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleEstadoChange = (e) => {
    setEstadoSeleccionado(e.target.value);
    onFilter(e.target.value);
  };

  return (
    <Form className="mb-4 project-filter">
      <Row className="justify-content-center">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar proyecto..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text><FaFilter /></InputGroup.Text>
            <Form.Select value={estadoSeleccionado} onChange={handleEstadoChange}>
              {estados.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Col>
      </Row>
    </Form>
  );
};

export default AdmProjectFilter;