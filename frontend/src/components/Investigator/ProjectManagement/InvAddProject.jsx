import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { postData } from "../../../services/apiServices";
import NavInvestigator from "../../../components/Investigator/Common/NavInvestigator";
import AlertComponent from "../../../components/Common/AlertComponent";
import { FaArrowLeft, FaArrowRight, FaSave, FaPlus, FaTrash, FaUpload } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import "../../../css/Investigator/AddProjectView.css";

const InvAddProject = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    objetivos: "",
    presupuesto: 0,
    fechaInicio: new Date(),
    fechaFin: new Date(),
    hitos: [{ nombre: "", fecha: new Date() }],
    recursos: [""],
    imagen: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDateChange = (name, date) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: date,
    }));
  };

  const addHito = () => {
    setFormData((prevData) => ({
      ...prevData,
      hitos: [...prevData.hitos, { nombre: "", fecha: new Date() }],
    }));
  };

  const removeHito = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      hitos: prevData.hitos.filter((_, i) => i !== index),
    }));
  };

  const handleHitoChange = (index, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      hitos: prevData.hitos.map((hito, i) =>
        i === index ? { ...hito, [field]: value } : hito
      ),
    }));
  };

  const addRecurso = () => {
    setFormData((prevData) => ({
      ...prevData,
      recursos: [...prevData.recursos, ""],
    }));
  };

  const removeRecurso = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      recursos: prevData.recursos.filter((_, i) => i !== index),
    }));
  };

  const handleRecursoChange = (index, value) => {
    setFormData((prevData) => ({
      ...prevData,
      recursos: prevData.recursos.map((recurso, i) =>
        i === index ? value : recurso
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProjectData = new FormData();

    newProjectData.append('nombre', formData.nombre);
    newProjectData.append('descripcion', formData.descripcion);
    newProjectData.append('objetivos', formData.objetivos);
    newProjectData.append('presupuesto', formData.presupuesto);

    newProjectData.append('cronograma[fechaInicio]', formData.fechaInicio.toISOString());
    newProjectData.append('cronograma[fechaFin]', formData.fechaFin.toISOString());

    formData.hitos.forEach((hito, index) => {
      newProjectData.append(`hitos[${index}][nombre]`, hito.nombre);
      newProjectData.append(`hitos[${index}][fecha]`, hito.fecha.toISOString());
    });
    formData.recursos.forEach((recurso, index) => {
      newProjectData.append(`recursos[${index}]`, recurso);
    });

    if (selectedFile) {
      newProjectData.append('imagen', selectedFile);
    }

    try {
      await postData("projects", newProjectData);
      AlertComponent.success("Proyecto agregado exitosamente");
      navigate("/invest/proyectos");
    } catch (error) {
      let errorMessage = "Error al crear el Proyecto.";
      let detailedErrors = [];

      try {
        const parsedError = JSON.parse(error.message);
        errorMessage = parsedError.message;
        detailedErrors = parsedError.errors || [];
      } catch (parseError) {
        errorMessage = error.message;
      }
      AlertComponent.error(errorMessage);
      detailedErrors.forEach((err) => AlertComponent.error(err));
    }
  };

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  return (
    <>
      <NavInvestigator />
      <div className="add-project-view-container">
        <div className="add-wizard-container">
          <h2 className="add-h2">Agregar Proyecto</h2>
          <div className="add-step-indicator">
            <div className={`add-step ${currentStep >= 1 ? 'active' : ''}`}>Información Básica</div>
            <div className={`add-step ${currentStep >= 2 ? 'active' : ''}`}>Cronograma</div>
            <div className={`add-step ${currentStep >= 3 ? 'active' : ''}`}>Hitos y Recursos</div>
            <div className={`add-step ${currentStep >= 4 ? 'active' : ''}`}>Imagen</div>
          </div>
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="add-form-step">
                <div className="add-form-group">
                  <label htmlFor="nombre">Nombre del Proyecto</label>
                  <input
                    className="add-input"
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="add-form-group">
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea
                    className="add-textarea"
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <div className="add-form-group">
                  <label htmlFor="objetivos">Objetivos</label>
                  <textarea
                    className="add-textarea"
                    id="objetivos"
                    name="objetivos"
                    value={formData.objetivos}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="add-form-group">
                  <label htmlFor="presupuesto">Presupuesto</label>
                  <input
                    className="add-input"
                    type="number"
                    id="presupuesto"
                    name="presupuesto"
                    value={formData.presupuesto}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="add-form-step">
                <div className="add-form-group">
                  <label>Fecha de Inicio</label>
                  <DatePicker
                    selected={formData.fechaInicio}
                    onChange={(date) => handleDateChange("fechaInicio", date)}
                    required
                  />
                </div>
                <div className="add-form-group">
                  <label>Fecha de Fin</label>
                  <DatePicker
                    selected={formData.fechaFin}
                    onChange={(date) => handleDateChange("fechaFin", date)}
                    required
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="add-form-step">
                <div className="add-form-group">
                  <label>Hitos</label>
                  {formData.hitos.map((hito, index) => (
                    <div key={index} className="hito-group">
                      <input
                        className="add-input"
                        type="text"
                        placeholder="Nombre del hito"
                        value={hito.nombre}
                        onChange={(e) =>
                          handleHitoChange(index, "nombre", e.target.value)
                        }
                        required
                      />
                      <DatePicker
                        selected={hito.fecha}
                        onChange={(date) => handleHitoChange(index, "fecha", date)}
                        required
                      />
                      <button type="button" className="add-remove-btn" onClick={() => removeHito(index)}>
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="add-btn" onClick={addHito}>
                    <FaPlus /> Añadir Hito
                  </button>
                </div>
                <div className="add-form-group">
                  <label>Recursos</label>
                  {formData.recursos.map((recurso, index) => (
                    <div key={index} className="add-recurso-group">
                      <input
                        className="add-input"
                        type="text"
                        placeholder="Recurso"
                        value={recurso}
                        onChange={(e) => handleRecursoChange(index, e.target.value)}
                        required
                      />
                      <button type="button" className="add-remove-btn" onClick={() => removeRecurso(index)}>
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="add-btn" onClick={addRecurso}>
                    <FaPlus /> Añadir Recurso
                  </button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="add-form-step">
                <div className="add-form-group">
                  <label htmlFor="imagen">Imagen del Proyecto</label>
                  <input
                    type="file"
                    id="imagen"
                    name="imagen"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="add-file-input"
                  />
                  <label htmlFor="imagen" className="add-file-label">
                    <FaUpload /> Subir Imagen
                  </label>
                  {previewImage && (
                    <div className="add-image-preview">
                      <img src={previewImage} alt="Vista previa" />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="add-form-navigation">
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className="add-nav-btn add-prev-btn">
                  <FaArrowLeft /> Anterior
                </button>
              )}
              {currentStep < 4 && (
                <button type="button" onClick={nextStep} className="add-nav-btn add-next-btn">
                  Siguiente <FaArrowRight />
                </button>
              )}
              {currentStep === 4 && (
                <button type="submit" className="add-nav-btn add-save-btn">
                  <FaSave /> Guardar Proyecto
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default InvAddProject;