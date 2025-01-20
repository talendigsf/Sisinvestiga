import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { getDataById, putData } from "../../../services/apiServices";
import NavInvestigator from "../../../components/Investigator/Common/NavInvestigator";
import AlertComponent from "../../../components/Common/AlertComponent";
import { FaArrowLeft, FaArrowRight, FaSave, FaPlus, FaTrash, FaUpload } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import "../../../css/Investigator/EditProjectView.css";

const InvEditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    objetivos: "",
    presupuesto: 0,
    estado: "Planeado",
    fechaInicio: new Date(),
    fechaFin: new Date(),
    hitos: [{ nombre: "", fecha: new Date() }],
    recursos: [""],
    imagen: ""
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const project = await getDataById("projects", id);

        if (project) {
          setFormData({
            nombre: project.nombre,
            descripcion: project.descripcion,
            objetivos: project.objetivos,
            presupuesto: project.presupuesto,
            estado: project.estado,
            fechaInicio: new Date(project.cronograma.fechaInicio),
            fechaFin: new Date(project.cronograma.fechaFin),
            hitos: project.hitos.length > 0
              ? project.hitos.map(h => ({ ...h, fecha: new Date(h.fecha) }))
              : [{ nombre: "", fecha: new Date() }],
            recursos: project.recursos.length > 0 ? project.recursos : [""],
            imagen: project.imagen,
          });
          setPreviewImage(project.imagen);
        }
      } catch (error) {
        handleError(error, "Ocurrió un error al cargar los datos del proyecto.");
      }
    };

    fetchProject();
  }, [id]);

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
    const updatedProject = new FormData();

    updatedProject.append('nombre', formData.nombre);
    updatedProject.append('descripcion', formData.descripcion);
    updatedProject.append('objetivos', formData.objetivos);
    updatedProject.append('presupuesto', formData.presupuesto);
    updatedProject.append('estado', formData.estado);

    updatedProject.append('cronograma[fechaInicio]', formData.fechaInicio.toISOString());
    updatedProject.append('cronograma[fechaFin]', formData.fechaFin.toISOString());

    formData.hitos.forEach((hito, index) => {
      updatedProject.append(`hitos[${index}][nombre]`, hito.nombre);
      updatedProject.append(`hitos[${index}][fecha]`, hito.fecha.toISOString());
    });

    formData.recursos.forEach((recurso, index) => {
      updatedProject.append(`recursos[${index}]`, recurso);
    });

    if (selectedFile) {
      updatedProject.append('imagen', selectedFile);
    }

    try {
      await putData("projects/investigator", id, updatedProject);
      AlertComponent.success("Proyecto actualizado exitosamente.");
      navigate("/invest/proyectos");
    } catch (error) {
      handleError(error, "Ocurrió un error al actualizar el Proyecto.");
    }
  };

  const handleError = (error, defaultMessage) => {
    let errorMessage = defaultMessage;
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
  };

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  return (
    <>
      <NavInvestigator />
      <div className="edit-project-view-container">
        <div className="edit-wizard-container">
          <h2 className="edit-h2">Editar Proyecto</h2>
          <div className="edit-step-indicator">
            <div className={`edit-step ${currentStep >= 1 ? 'active' : ''}`}>Información Básica</div>
            <div className={`edit-step ${currentStep >= 2 ? 'active' : ''}`}>Cronograma</div>
            <div className={`edit-step ${currentStep >= 3 ? 'active' : ''}`}>Hitos y Recursos</div>
            <div className={`edit-step ${currentStep >= 4 ? 'active' : ''}`}>Imagen</div>
          </div>
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="edit-form-step">
                <div className="edit-form-group">
                  <label htmlFor="nombre">Nombre del Proyecto</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="edit-input"
                  />
                </div>
                <div className="edit-form-group">
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                    className="edit-textarea"
                  ></textarea>
                </div>
                <div className="edit-form-group">
                  <label htmlFor="objetivos">Objetivos</label>
                  <textarea
                    id="objetivos"
                    name="objetivos"
                    value={formData.objetivos}
                    onChange={handleChange}
                    className="edit-textarea"
                  ></textarea>
                </div>
                <div className="edit-form-group">
                  <label htmlFor="presupuesto">Presupuesto</label>
                  <input
                    type="number"
                    id="presupuesto"
                    name="presupuesto"
                    value={formData.presupuesto}
                    onChange={handleChange}
                    required
                    className="edit-input"
                  />
                </div>
                <div className="edit-form-group">
                  <label htmlFor="estado">Estado del Proyecto</label>
                  <input
                    type="text"
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    readOnly
                    className="edit-readonly-input"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="edit-form-step">
                <div className="edit-form-group">
                  <label>Fecha de Inicio</label>
                  <DatePicker
                    selected={formData.fechaInicio}
                    onChange={(date) => handleDateChange("fechaInicio", date)}
                    required
                    className="edit-datepicker"
                  />
                </div>
                <div className="edit-form-group">
                  <label>Fecha de Fin</label>
                  <DatePicker
                    selected={formData.fechaFin}
                    onChange={(date) => handleDateChange("fechaFin", date)}
                    required
                    className="edit-datepicker"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="edit-form-step">
                <div className="edit-form-group">
                  <label>Hitos</label>
                  {formData.hitos.map((hito, index) => (
                    <div key={index} className="edit-hito-group">
                      <input
                        type="text"
                        placeholder="Nombre del hito"
                        value={hito.nombre}
                        onChange={(e) => handleHitoChange(index, "nombre", e.target.value)}
                        required
                        className="edit-input"
                      />
                      <DatePicker
                        selected={hito.fecha}
                        onChange={(date) => handleHitoChange(index, "fecha", date)}
                        required
                        className="edit-datepicker"
                      />
                      <button type="button" className="edit-remove-btn" onClick={() => removeHito(index)}>
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="edit-add-btn" onClick={addHito}>
                    <FaPlus /> Añadir Hito
                  </button>
                </div>
                <div className="edit-form-group">
                  <label>Recursos</label>
                  {formData.recursos.map((recurso, index) => (
                    <div key={index} className="edit-recurso-group">
                      <input
                        type="text"
                        placeholder="Recurso"
                        value={recurso}
                        onChange={(e) => handleRecursoChange(index, e.target.value)}
                        required
                        className="edit-input"
                      />
                      <button type="button" className="edit-remove-btn" onClick={() => removeRecurso(index)}>
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="edit-add-btn" onClick={addRecurso}>
                    <FaPlus /> Añadir Recurso
                  </button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="edit-form-step">
                <div className="edit-form-group">
                  <label htmlFor="imagen">Imagen del Proyecto</label>
                  <input
                    type="file"
                    id="imagen"
                    name="imagen"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="edit-file-input"
                  />
                  <label htmlFor="imagen" className="edit-file-label">
                    <FaUpload /> Cambiar Imagen
                  </label>
                  {previewImage && (
                    <div className="edit-image-preview">
                      <img src={previewImage} alt="Vista previa" />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="edit-form-navigation">
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className="edit-nav-btn edit-prev-btn">
                  <FaArrowLeft /> Anterior
                </button>
              )}
              {currentStep < 4 && (
                <button type="button" onClick={nextStep} className="edit-nav-btn edit-next-btn">
                  Siguiente <FaArrowRight />
                </button>
              )}
              {currentStep === 4 && (
                <button type="submit" className="edit-nav-btn edit-save-btn">
                  <FaSave /> Guardar Cambios
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default InvEditProject;