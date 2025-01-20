import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, ProgressBar, Form, Button } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';
import { getDataById, getData, putData } from '../../../services/apiServices';
import AlertComponent from '../../Common/AlertComponent';
import '../../../css/Admin/AdmEditProject.css';

import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';
import Step4 from './Steps/Step4';
import Step5 from './Steps/Step5';

const AdmEditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    objetivos: '',
    presupuesto: 0,
    estado: 'Planeado',
    fechaInicio: new Date(),
    fechaFin: new Date(),
    hitos: [{ nombre: '', fecha: new Date() }],
    recursos: [''],
    imagen: ''
  });
  const [investigadoresDisponibles, setInvestigadoresDisponibles] = useState([]);
  const [investigadoresSeleccionados, setInvestigadoresSeleccionados] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchInvestigadores = async () => {
      try {
        const usuarios = await getData('users');
        const investigadores = usuarios.filter(user => user.role.roleName === 'Investigador');
        setInvestigadoresDisponibles(investigadores);
      } catch (error) {
        console.error(error);
        AlertComponent.error('Error loading list of researchers');
      }
    };

    fetchInvestigadores();
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const project = await getDataById('projects', id);
        if (project) {
          setFormData({
            nombre: project.nombre || '',
            descripcion: project.descripcion || '',
            objetivos: project.objetivos || '',
            presupuesto: project.presupuesto || 0,
            estado: project.estado || 'Planeado',
            fechaInicio: project.cronograma ? new Date(project.cronograma.fechaInicio) : new Date(),
            fechaFin: project.cronograma ? new Date(project.cronograma.fechaFin) : new Date(),
            hitos: Array.isArray(project.hitos) && project.hitos.length > 0
              ? project.hitos.map(h => ({ ...h, fecha: new Date(h.fecha) }))
              : [{ nombre: '', fecha: new Date() }],
            recursos: Array.isArray(project.recursos) && project.recursos.length > 0
              ? project.recursos
              : [''],
            imagen: project.imagen || '',
          });
          setPreviewImage(project.imagen || null);
          setInvestigadoresSeleccionados(project.investigadores.map(inv => inv._id));
        }
      } catch (error) {
        console.error(error);
        AlertComponent.error('Error loading project data');
      }
    };

    fetchProject();
  }, [id]);

  // Funciones de manejo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (name, date) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: date,
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

  const addHito = () => {
    setFormData(prevData => ({
      ...prevData,
      hitos: [...prevData.hitos, { nombre: '', fecha: new Date() }],
    }));
  };

  const removeHito = (index) => {
    setFormData(prevData => ({
      ...prevData,
      hitos: prevData.hitos.filter((_, i) => i !== index),
    }));
  };

  const handleHitoChange = (index, field, value) => {
    setFormData(prevData => ({
      ...prevData,
      hitos: prevData.hitos.map((hito, i) =>
        i === index ? { ...hito, [field]: value } : hito
      ),
    }));
  };

  const addRecurso = () => {
    setFormData(prevData => ({
      ...prevData,
      recursos: [...prevData.recursos, ''],
    }));
  };

  const removeRecurso = (index) => {
    setFormData(prevData => ({
      ...prevData,
      recursos: prevData.recursos.filter((_, i) => i !== index),
    }));
  };

  const handleRecursoChange = (index, value) => {
    setFormData(prevData => ({
      ...prevData,
      recursos: prevData.recursos.map((recurso, i) =>
        i === index ? value : recurso
      ),
    }));
  };

  const handleInvestigadorChange = (e, investigadorId) => {
    if (e.target.checked) {
      setInvestigadoresSeleccionados(prev => [...prev, investigadorId]);
    } else {
      setInvestigadoresSeleccionados(prev => prev.filter(id => id !== investigadorId));
    }
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

    // Agregar investigadores
    investigadoresSeleccionados.forEach((id) => {
      updatedProject.append('investigadores', id);
    });

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
      await putData("projects", id, updatedProject);
      AlertComponent.success("Project successfully updated.");
      navigate('/admin/listarproyectos');
    } catch (error) {
      handleError(error, "OAn error occurred while updating the Project.");
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

  const renderStep = () => {
    const stepProps = { formData, handleChange, handleDateChange };

    switch (currentStep) {
      case 1:
        return <Step1 {...stepProps} />;
      case 2:
        return <Step2 {...stepProps} />;
      case 3:
        return (
          <Step3
            formData={formData}
            addHito={addHito}
            removeHito={removeHito}
            handleHitoChange={handleHitoChange}
            addRecurso={addRecurso}
            removeRecurso={removeRecurso}
            handleRecursoChange={handleRecursoChange}
          />
        );
      case 4:
        return (
          <Step4
            investigadoresDisponibles={investigadoresDisponibles}
            investigadoresSeleccionados={investigadoresSeleccionados}
            handleInvestigadorChange={handleInvestigadorChange}
          />
        );
      case 5:
        return (
          <Step5
            previewImage={previewImage}
            selectedFile={selectedFile}
            handleImageChange={handleImageChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container className="my-5 adm-edit-project">
      <h1 className="text-center mb-4">Edit Project</h1>
      <Card>
        <Card.Body>
          <ProgressBar now={(currentStep / 5) * 100} className="mb-4" />
          <Form onSubmit={handleSubmit}>
            {renderStep()}
            <div className="d-flex justify-content-between mt-4">
              {currentStep > 1 && (
                <Button variant="secondary" onClick={() => setCurrentStep(currentStep - 1)} type="button">
                  Previous
                </Button>
              )}
              {currentStep < 5 && (
                <Button variant="primary" onClick={() => setCurrentStep(currentStep + 1)} type="button">
                  Next
                </Button>
              )}
              {currentStep === 5 && (
                <Button variant="success" type="submit">
                  <FaSave /> Save Changes
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdmEditProject;