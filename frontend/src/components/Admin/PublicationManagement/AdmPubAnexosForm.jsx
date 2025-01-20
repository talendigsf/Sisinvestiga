import React, { useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaUpload, FaTrash } from 'react-icons/fa';

const AdmPubAnexosForm = ({
  existingAnexos,
  newAnexos,
  setNewAnexos,
  anexosToDelete,
  setAnexosToDelete,
  isEditing,
}) => {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewAnexos((prevAnexos) => [...prevAnexos, ...files]);
  };

  const removeExistingAnexo = (anexoId) => {
    setAnexosToDelete((prev) => [...prev, anexoId]);
  };

  const removeNewAnexo = (index) => {
    setNewAnexos((prevAnexos) => prevAnexos.filter((_, i) => i !== index));
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>Anexos</Form.Label>
      {isEditing ? (
        <>
          {/* Input de archivos */}
          <div>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <Button variant="secondary" onClick={() => fileInputRef.current.click()}>
              <FaUpload /> Agregar Anexos
            </Button>
          </div>

          {/* Lista de anexos existentes */}
          <div className="mt-3">
            <h6>Anexos Existentes</h6>
            <ul>
              {existingAnexos
                .filter(anexo => !anexosToDelete.includes(anexo._id))
                .map((anexo) => (
                  <li key={anexo._id}>
                    {anexo.nombre} - {anexo.tipo} -{' '}
                    <a href={anexo.url} target="_blank" rel="noreferrer">
                      Ver Archivo
                    </a>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeExistingAnexo(anexo._id)}
                      className="ms-2"
                    >
                      <FaTrash /> Eliminar
                    </Button>
                  </li>
                ))}
            </ul>
          </div>

          {/* Lista de nuevos anexos */}
          {newAnexos.length > 0 && (
            <div className="mt-3">
              <h6>Nuevos Anexos</h6>
              <ul>
                {newAnexos.map((file, index) => (
                  <li key={index}>
                    {file.name}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeNewAnexo(index)}
                      className="ms-2"
                    >
                      <FaTrash /> Eliminar
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <ul>
          {existingAnexos.map((anexo) => (
            <li key={anexo._id}>
              {anexo.nombre} - {anexo.tipo} -{' '}
              <a href={anexo.url} target="_blank" rel="noreferrer">
                Ver Archivo
              </a>
            </li>
          ))}
        </ul>
      )}
    </Form.Group>
  );
};

export default AdmPubAnexosForm