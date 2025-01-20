import React from 'react';
import { Form, Button } from 'react-bootstrap';

const AdmPubAuthorsForm = ({ autores, isEditing, usuarios, setEditedPublication }) => {
  const handleAuthorChange = (index, newAuthorId) => {
    const usuarioSeleccionado = usuarios.find((u) => u._id === newAuthorId);
    const nuevosAutores = [...autores];
    nuevosAutores[index] = usuarioSeleccionado;
    setEditedPublication((prev) => ({ ...prev, autores: nuevosAutores }));
  };

  const handleAddAuthor = () => {
    const nuevosAutores = [...autores, usuarios[0]];
    setEditedPublication((prev) => ({ ...prev, autores: nuevosAutores }));
  };

  const handleRemoveAuthor = (index) => {
    const nuevosAutores = autores.filter((_, i) => i !== index);
    setEditedPublication((prev) => ({ ...prev, autores: nuevosAutores }));
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>Autores</Form.Label>
      {isEditing ? (
        <>
          {autores.map((autor, index) => (
            <div key={index} className="mb-2">
              <Form.Control
                as="select"
                value={autor._id}
                onChange={(e) => handleAuthorChange(index, e.target.value)}
              >
                {usuarios.map((usuario) => (
                  <option key={usuario._id} value={usuario._id}>
                    {usuario.nombre} {usuario.apellido}
                  </option>
                ))}
              </Form.Control>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRemoveAuthor(index)}
                className="mt-1"
              >
                Eliminar
              </Button>
            </div>
          ))}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleAddAuthor}
          >
            Agregar Autor
          </Button>
        </>
      ) : (
        <Form.Control
          type="text"
          value={autores.map((autor) => `${autor.nombre} ${autor.apellido}`).join(', ')}
          readOnly
        />
      )}
    </Form.Group>
  );
};

export default AdmPubAuthorsForm