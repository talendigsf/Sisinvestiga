import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaUpload } from 'react-icons/fa';

const Step5 = ({ previewImage, selectedFile, handleImageChange }) => (
  <Form.Group className="mb-3">
    <Form.Label>Project Image</Form.Label>
    <div className="d-flex align-items-center mb-3">
      <Form.Control
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="d-none"
        id="project-image"
      />
      <Button as="label" htmlFor="project-image" variant="outline-primary">
        <FaUpload /> Select Image
      </Button>
      {selectedFile && <span className="ml-3">{selectedFile.name}</span>}
    </div>
    {previewImage && (
      <div className="image-preview">
        <img src={previewImage} alt="Vista previa" className="img-fluid" />
      </div>
    )}
  </Form.Group>
);

export default Step5;