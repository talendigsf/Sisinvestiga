import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const AdmPublicationForm = ({ publication, isEditing, handleInputChange, proyectos }) => {
  return (
    <Form>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              name="titulo"
              value={publication.titulo}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Tipo de Publicación</Form.Label>
            <Form.Control
              as="select"
              name="tipoPublicacion"
              value={publication.tipoPublicacion}
              onChange={handleInputChange}
              disabled={!isEditing}
            >
              <option value="Articulo">Artículo</option>
              <option value="Informe">Informe</option>
              <option value="Tesis">Tesis</option>
              <option value="Presentacion">Presentación</option>
              <option value="Otro">Otro</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              name="fecha"
              value={publication.fecha ? publication.fecha.split('T')[0] : ''}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Control
              as="select"
              name="estado"
              value={publication.estado}
              onChange={handleInputChange}
              disabled={!isEditing}
            >
              <option value="Borrador">Borrador</option>
              <option value="Revisado">Revisado</option>
              <option value="Publicado">Publicado</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>Resumen</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="resumen"
          value={publication.resumen}
          onChange={handleInputChange}
          readOnly={!isEditing}
        />
      </Form.Group>

      {/* Palabras Clave */}
      <Form.Group className="mb-3">
        <Form.Label>Palabras Clave</Form.Label>
        <Form.Control
          type="text"
          name="palabrasClave"
          value={publication.palabrasClave.join(', ')}
          onChange={(e) => {
            const value = e.target.value.split(',').map((word) => word.trim());
            handleInputChange({
              target: {
                name: 'palabrasClave',
                value: value,
              },
            });
          }}
          readOnly={!isEditing}
        />
      </Form.Group>

      {/* Proyecto */}
      <Form.Group className="mb-3">
        <Form.Label>Proyecto</Form.Label>
        {isEditing ? (
          <Form.Control
            as="select"
            name="proyecto"
            value={publication.proyecto?._id || ''}
            onChange={(e) => {
              const proyectoSeleccionado = proyectos.find((p) => p._id === e.target.value);
              handleInputChange({
                target: {
                  name: 'proyecto',
                  value: proyectoSeleccionado,
                },
              });
            }}
          >
            <option value="">No asignado</option>
            {proyectos.map((proyecto) => (
              <option key={proyecto._id} value={proyecto._id}>
                {proyecto.nombre}
              </option>
            ))}
          </Form.Control>
        ) : (
          <Form.Control
            type="text"
            value={publication.proyecto ? publication.proyecto.nombre : 'No asignado'}
            readOnly
          />
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Estado de Eliminación</Form.Label>
        <Form.Control
          type="text"
          value={publication.isDeleted ? 'Eliminado' : 'Activo'}
          readOnly
        />
      </Form.Group>
    </Form>
  );
}

export default AdmPublicationForm