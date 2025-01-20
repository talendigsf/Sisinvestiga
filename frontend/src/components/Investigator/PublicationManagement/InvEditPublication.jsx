import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { getDataById, getUserData, putData } from "../../../services/apiServices";
import NavInvestigator from "../../../components/Investigator/Common/NavInvestigator";
import AlertComponent from "../../../components/Common/AlertComponent";
import { FaArrowLeft, FaArrowRight, FaSave, FaUpload, FaTrash } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import "../../../css/Investigator/EditPublicationView.css";

const InvEditPublication = () => {
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    titulo: "",
    fecha: new Date(),
    proyecto: "",
    revista: "",
    resumen: "",
    palabrasClave: "",
    tipoPublicacion: "",
    idioma: 'Español',
  });

  const [proyectoNombre, setProyectoNombre] = useState("");
  const [tiposPublicacion, setTiposPublicacion] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [existingAnexos, setExistingAnexos] = useState([]);
  const [newAnexos, setNewAnexos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userPublicationsData = await getUserData("publications");
        setTiposPublicacion(userPublicationsData.tiposPublicacion || []);

        const publicationData = await getDataById('publications/getpublication', id);
        if (publicationData) {
          setFormData({
            titulo: publicationData.titulo,
            fecha: new Date(publicationData.fecha),
            proyecto: publicationData.proyecto?._id || "",
            revista: publicationData.revista,
            resumen: publicationData.resumen,
            palabrasClave: publicationData.palabrasClave.join(", "),
            tipoPublicacion: publicationData.tipoPublicacion,
            idioma: publicationData.idioma,
            imagen: publicationData.imagen,
          });
          setProyectoNombre(publicationData.proyecto?.nombre || "No asociado");
          setPreviewImage(publicationData.imagen);
          setExistingAnexos(publicationData.anexos || []);
        }
      } catch (error) {
        handleError(error, "Ocurrió un error al cargar los datos al formulario.");
      }
    };

    fetchData();
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
  
  const handleAnexoChange = (e) => {
    const files = Array.from(e.target.files);
    setNewAnexos((prevAnexos) => [...prevAnexos, ...files]);
  };

  const removeExistingAnexo = (index) => {
    setExistingAnexos((prevAnexos) => prevAnexos.filter((_, i) => i !== index));
  };

  const removeNewAnexo = (index) => {
    setNewAnexos((prevAnexos) => prevAnexos.filter((_, i) => i !== index));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      fecha: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('titulo', formData.titulo);
    formDataToSend.append('revista', formData.revista);
    formDataToSend.append('resumen', formData.resumen);

    // Procesar 'palabrasClave' como un arreglo
    const palabrasClaveArray = formData.palabrasClave.split(',').map((p) => p.trim());
    formDataToSend.append('palabrasClave', JSON.stringify(palabrasClaveArray));

    formDataToSend.append('tipoPublicacion', formData.tipoPublicacion);
    formDataToSend.append('idioma', formData.idioma);
    formDataToSend.append('fecha', formData.fecha.toISOString());

    // Si se seleccionó una nueva imagen
    if (selectedFile) {
      formDataToSend.append('imagen', selectedFile);
    }

    // Agregar nuevos anexos
    newAnexos.forEach((anexo) => {
      formDataToSend.append('anexos', anexo);
    });

    // Enviar los anexos existentes (los que no se eliminaron)
    formDataToSend.append('existingAnexos', JSON.stringify(existingAnexos));

    try {
      await putData("publications", id, formDataToSend);
      AlertComponent.success("Publicación actualizada exitosamente.");
      navigate("/invest/publicaciones");
    } catch (error) {
      handleError(error, "Ocurrió un error al tratar de actualizar la publicación.");
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
      <div className="edit-publication-view-container">
        <div className="edit-wizard-container">
          <h2 className="edit-h2">Editar Publicación</h2>
          <div className="edit-step-indicator">
            <div className={`edit-step ${currentStep >= 1 ? 'active' : ''}`}>Información Básica</div>
            <div className={`edit-step ${currentStep >= 2 ? 'active' : ''}`}>Detalles</div>
            <div className={`edit-step ${currentStep >= 3 ? 'active' : ''}`}>Contenido y Anexos</div>
            <div className={`edit-step ${currentStep >= 4 ? 'active' : ''}`}>Imagen</div>
          </div>
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="edit-form-step">
                <div className="edit-form-group">
                  <label htmlFor="titulo">Título de la Publicación</label>
                  <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    required
                    className="edit-input"
                  />
                </div>
                <div className="edit-form-group">
                  <label>Fecha de Publicación</label>
                  <DatePicker
                    selected={formData.fecha}
                    onChange={handleDateChange}
                    required
                    className="edit-datepicker"
                  />
                </div>
                <div className="edit-form-group">
                  <label htmlFor="proyecto">Proyecto Asociado</label>
                  <input
                    type="text"
                    id="proyecto"
                    name="proyecto"
                    value={proyectoNombre}
                    readOnly
                    className="edit-input edit-readonly"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="edit-form-step">
                <div className="edit-form-group">
                  <label htmlFor="revista">Revista</label>
                  <input
                    type="text"
                    id="revista"
                    name="revista"
                    value={formData.revista}
                    onChange={handleChange}
                    required
                    className="edit-input"
                  />
                </div>
                <div className="edit-form-group">
                  <label htmlFor="tipoPublicacion">Tipo de Publicación</label>
                  <select
                    id="tipoPublicacion"
                    name="tipoPublicacion"
                    value={formData.tipoPublicacion}
                    onChange={handleChange}
                    required
                    className="edit-select"
                  >
                    <option value="">Seleccionar Tipo de Publicación</option>
                    {tiposPublicacion.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="edit-form-group">
                  <label htmlFor="idioma">Idioma</label>
                  <input
                    type="text"
                    id="idioma"
                    name="idioma"
                    value={formData.idioma}
                    onChange={handleChange}
                    required
                    className="edit-input"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="edit-form-step">
                <div className="edit-form-group">
                  <label htmlFor="resumen">Resumen</label>
                  <textarea
                    id="resumen"
                    name="resumen"
                    value={formData.resumen}
                    onChange={handleChange}
                    className="edit-textarea"
                  ></textarea>
                </div>
                <div className="edit-form-group">
                  <label htmlFor="palabrasClave">Palabras Clave (separadas por coma)</label>
                  <input
                    type="text"
                    id="palabrasClave"
                    name="palabrasClave"
                    value={formData.palabrasClave}
                    onChange={handleChange}
                    className="edit-input"
                  />
                </div>
                <div className="edit-form-group">
                  <label htmlFor="anexos">Anexos</label>
                  <input
                    type="file"
                    id="anexos"
                    name="anexos"
                    onChange={handleAnexoChange}
                    multiple
                    className="edit-file-input"
                  />
                  <label htmlFor="anexos" className="edit-file-label">
                    <FaUpload /> Subir Nuevos Anexos
                  </label>
                  <div className="edit-anexos-list">
                    {/* Anexos Existentes */}
                    {existingAnexos.map((anexo, index) => (
                      <div key={`existing-${index}`} className="edit-anexo-item">
                        <span>{anexo.nombre}</span>
                        <button type="button" onClick={() => removeExistingAnexo(index)} className="edit-remove-btn">
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    {/* Nuevos Anexos */}
                    {newAnexos.map((anexo, index) => (
                      <div key={`new-${index}`} className="edit-anexo-item">
                        <span>{anexo.name}</span>
                        <button type="button" onClick={() => removeNewAnexo(index)} className="edit-remove-btn">
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="edit-form-step">
                <div className="edit-form-group">
                  <label htmlFor="imagen">Imagen de la Publicación</label>
                  <input
                    type="file"
                    id="imagen"
                    name="imagen"
                    onChange={handleImageChange}
                    accept="image/*"
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
                  <FaSave /> Actualizar Publicación
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default InvEditPublication;