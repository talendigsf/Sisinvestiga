import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaGraduationCap, FaTasks, FaPlus, FaTrash } from "react-icons/fa";
import AlertComponent from "../../Common/AlertComponent";
import { postData } from "../../../services/apiServices";
import ucsdImage from "../../../assets/img/ucsd.webp";
import logo from "../../../assets/img/LogoUCSD.jpg";
import "../../../css/auth/Register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    especializacion: "",
    responsabilidad: "",
  });
  const [responsabilidadesList, setResponsabilidadesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await postData("users/register", {
        ...formData,
        responsabilidades: responsabilidadesList,
      });

      AlertComponent.success("El investigador ha sido registrado correctamente.");
      resetForm();
    } catch (error) {
      let errorMessage = "Ocurrió un error durante el registro.";
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
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      especializacion: "",
      responsabilidad: "",
    });
    setResponsabilidadesList([]);
  };

  const addResponsabilidad = (e) => {
    e.preventDefault();
    if (formData.responsabilidad) {
      setResponsabilidadesList(prevList => [...prevList, formData.responsabilidad]);
      setFormData(prevState => ({ ...prevState, responsabilidad: "" }));
    }
  };

  const removeResponsabilidad = (index) => {
    setResponsabilidadesList(prevList => prevList.filter((_, i) => i !== index));
  };

  return (
    <div className="register-page">
      <div className="register-left">
        <img src={ucsdImage} alt="UCSD" className="register-background" />
      </div>
      <div className="register-right">
        <div className="register-container">
          <Link to="/" className="logo-link">
            <img src={logo} alt="UCSD Logo" className="register-logo" />
          </Link>
          <h2>Registro de Investigador</h2>
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <FaGraduationCap className="input-icon" />
              <input
                type="text"
                name="especializacion"
                placeholder="Especialización"
                value={formData.especializacion}
                onChange={handleChange}
                required
              />
            </div>
            <div className="responsabilidades-container">
              <div className="input-group">
                <FaTasks className="input-icon" />
                <input
                  type="text"
                  name="responsabilidad"
                  placeholder="Responsabilidad"
                  value={formData.responsabilidad}
                  onChange={handleChange}
                />
              </div>
              <button
                className="add-btn"
                onClick={addResponsabilidad}
                type="button"
              >
                <FaPlus />
              </button>
            </div>
            <ul className="responsabilidades-list">
              {responsabilidadesList.map((resp, index) => (
                <li key={index}>
                  <span className="responsabilidad-text">{resp}</span>
                  <button
                    onClick={() => removeResponsabilidad(index)}
                    type="button"
                    className="remove-btn"
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
            <button type="submit" className="register-btn" disabled={isLoading}>
              {isLoading ? "Registrando..." : "Registrar Investigador"}
            </button>
          </form>
          <div className="signin-option">
            <span>¿Ya tienes cuenta?</span>{" "}
            <Link to="/login" className="signin-link">
              Iniciar sesión
            </Link>
          </div>
          <footer className="footer">
            © {new Date().getFullYear()} Universidad Católica Santo Domingo - Todos los Derechos Reservados
          </footer>
        </div>
      </div>
    </div>
  );
}