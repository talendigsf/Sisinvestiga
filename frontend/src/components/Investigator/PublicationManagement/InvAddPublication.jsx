import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { postData, getUserData } from "../../../services/apiServices";
import NavInvestigator from "../../../components/Investigator/Common/NavInvestigator";
import AlertComponent from "../../../components/Common/AlertComponent";
import { FaArrowLeft, FaArrowRight, FaSave, FaUpload, FaTrash } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import "../../../css/Investigator/AddPublicationView.css";

const InvAddPublication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    titulo: "",
    fecha: new Date(),
    proyecto: "",
    revista: "",
    resumen: "",
    palabrasClave: "",
    tipoPublicacion: "",
    idioma: "Español",
    imagen: "",
    anexos: [],
  });
  const [proyectos, setProyectos] = useState([]);
  const [tiposPublicacion, setTiposPublicacion] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const proyectosData = await getUserData("projects");
        setProyectos(proyectosData.data || []);

        const tiposData = await getUserData("publications");
        setTiposPublicacion(tiposData.tiposPublicacion || []);
      } catch (error) {
        handleError(error, "Error al cargar los datos al Formulario");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      fecha: date,
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

  const handleAnexoChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      anexos: files,
    }));
  };

  const removeAnexo = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      anexos: prevData.anexos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('titulo', formData.titulo);
    formDataToSend.append('proyecto', formData.proyecto);
    formDataToSend.append('revista', formData.revista);
    formDataToSend.append('resumen', formData.resumen);

    // Procesar 'palabrasClave' como un arreglo
    const palabrasClaveArray = formData.palabrasClave.split(',').map((palabra) => palabra.trim());
    formDataToSend.append('palabrasClave', JSON.stringify(palabrasClaveArray));

    formDataToSend.append('tipoPublicacion', formData.tipoPublicacion);
    formDataToSend.append('idioma', formData.idioma);
    formDataToSend.append('fecha', formData.fecha.toISOString());

    // Agregar la imagen si está seleccionada
    if (selectedFile) {
      formDataToSend.append('imagen', selectedFile);
    }

    // Agregar cada anexo individualmente
    formData.anexos.forEach((anexo) => {
      formDataToSend.append('anexos', anexo);
    });

    try {
      await postData("publications", formDataToSend);
      AlertComponent.success("Publicación agregada exitosamente");
      navigate("/invest/publicaciones");
    } catch (error) {
      handleError(error, "Ocurrió un error al crear la Publicación.");
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
      <div className="add-publication-view-container">
        <div className="add-wizard-container">
          <h2 className="add-h2">Agregar Publicación</h2>
          <div className="add-step-indicator">
            <div className={`add-step ${currentStep >= 1 ? 'active' : ''}`}>Información Básica</div>
            <div className={`add-step ${currentStep >= 2 ? 'active' : ''}`}>Detalles</div>
            <div className={`add-step ${currentStep >= 3 ? 'active' : ''}`}>Contenido y Anexos</div>
            <div className={`add-step ${currentStep >= 4 ? 'active' : ''}`}>Imagen</div>
          </div>
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="add-form-step">
                <div className="add-form-group">
                  <label htmlFor="titulo">Título de la Publicación</label>
                  <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    required
                    className="add-input"
                  />
                </div>
                <div className="add-form-group">
                  <label>Fecha de Publicación</label>
                  <DatePicker
                    selected={formData.fecha}
                    onChange={handleDateChange}
                    required
                    className="add-datepicker"
                  />
                </div>
                <div className="add-form-group">
                  <label htmlFor="proyecto">Proyecto Asociado</label>
                  <select
                    id="proyecto"
                    name="proyecto"
                    value={formData.proyecto}
                    onChange={handleChange}
                    required
                    className="add-select"
                  >
                    <option value="">Seleccionar Proyecto</option>
                    {proyectos.map((proyecto) => (
                      <option key={proyecto._id} value={proyecto._id}>
                        {proyecto.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="add-form-step">
                <div className="add-form-group">
                  <label htmlFor="revista">Revista</label>
                  <input
                    type="text"
                    id="revista"
                    name="revista"
                    value={formData.revista}
                    onChange={handleChange}
                    required
                    className="add-input"
                  />
                </div>
                <div className="add-form-group">
                  <label htmlFor="tipoPublicacion">Tipo de Publicación</label>
                  <select
                    id="tipoPublicacion"
                    name="tipoPublicacion"
                    value={formData.tipoPublicacion}
                    onChange={handleChange}
                    required
                    className="add-select"
                  >
                    <option value="">Seleccionar Tipo de Publicación</option>
                    {tiposPublicacion.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="add-form-group">
                  <label htmlFor="idioma">Idioma</label>
                  <input
                    type="text"
                    id="idioma"
                    name="idioma"
                    value={formData.idioma}
                    onChange={handleChange}
                    required
                    className="add-input"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="add-form-step">
                <div className="add-form-group">
                  <label htmlFor="resumen">Resumen</label>
                  <textarea
                    id="resumen"
                    name="resumen"
                    value={formData.resumen}
                    onChange={handleChange}
                    className="add-textarea"
                  ></textarea>
                </div>
                <div className="add-form-group">
                  <label htmlFor="palabrasClave">Palabras Clave (separadas por coma)</label>
                  <input
                    type="text"
                    id="palabrasClave"
                    name="palabrasClave"
                    value={formData.palabrasClave}
                    onChange={handleChange}
                    className="add-input"
                  />
                </div>
                <div className="add-form-group">
                  <label htmlFor="anexos" className="add-file-label">
                    <FaUpload /> Subir Anexos
                  </label>
                  <input
                    type="file"
                    id="anexos"
                    name="anexos"
                    onChange={handleAnexoChange}
                    multiple
                    className="add-file-input"
                  />
                  <div className="add-anexos-list">
                    {formData.anexos.map((anexo, index) => (
                      <div key={index} className="add-anexo-item">
                        <span>{anexo.name}</span>
                        <button type="button" onClick={() => removeAnexo(index)} className="add-remove-btn">
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="add-form-step">
                <div className="add-form-group">
                  <label htmlFor="imagen">Imagen de la Publicación</label>
                  <input
                    type="file"
                    id="imagen"
                    name="imagen"
                    onChange={handleImageChange}
                    accept="image/*"
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
                  <FaSave /> Guardar Publicación
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default InvAddPublication;