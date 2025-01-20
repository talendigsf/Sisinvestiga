import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutAllUser } from "../../../features/auth/authSlice";
import PasswordChecklist from "react-password-checklist";
import { getUserData, putSelfData } from "../../../services/apiServices";
import NavInvestigator from "../../../components/Investigator/Common/NavInvestigator";
import AlertComponent from "../../../components/Common/AlertComponent";
import { FaUser, FaEnvelope, FaGraduationCap, FaTasks, FaKey, FaSignOutAlt, FaCamera, FaCalendarAlt, FaClock } from "react-icons/fa";
import "../../../css/Investigator/InvProfileView.css";

const InvProfileSettings = () => {
  const [user, setUser] = useState({
    nombre: "",
    apellido: "",
    email: "",
    especializacion: "",
    responsabilidades: [],
    fotoPerfil: "",
    createdAt: "",
    lastLogin: "",
  });
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData("users");
        setUser({
          ...data,
          responsabilidades: data.responsabilidades || [],
          lastLogin: data.lastLogin ? new Date(data.lastLogin).toLocaleString() : 'N/A',
          accountCreated: new Date(data.createdAt).toLocaleString(),
        });
      } catch (error) {
        AlertComponent.error("Error al cargar el perfil del usuario");
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    const formData = new FormData();
    formData.append('nombre', user.nombre);
    formData.append('apellido', user.apellido);
    formData.append('email', user.email);
    formData.append('especializacion', user.especializacion);
    formData.append('responsabilidades', user.responsabilidades.join(', ')); 
    
    if (currentPassword && newPassword) {
      formData.append('currentPassword', currentPassword);
      formData.append('newPassword', newPassword);
    }
  
    if (selectedFile) {
      formData.append('fotoPerfil', selectedFile);
    }

    try {
      const updatedUser = await putSelfData('users', formData);
      setUser({ ...user, ...updatedUser.user });
      AlertComponent.success("Perfil actualizado correctamente");
      setIsUpdating(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      let errorMessage = "Error al actualizar el usuario.";
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
      setIsUpdating(false);
    }
  };

  const handleLogoutAllSessions = () => {
    try {
      dispatch(logoutAllUser()).then(() => {
        navigate("/login");
      });
    } catch (error) {
      console.error("Error al cerrar las sesiones en todos los dispositivos:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, fotoPerfil: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <NavInvestigator />
      <div className="d-flex">
        <div className="flex-grow-1 bg-light">
          <div className="container py-4">
            <div className="card shadow">
              <div className="card-header p-bg-primary text-white">
                <div className="d-flex align-items-center">
                  <div className="position-relative">
                    <img
                      src={user.fotoPerfil || '/default-avatar.png'}
                      alt="Avatar"
                      className="rounded-circle profile-avatar"
                    />
                    <label htmlFor="profile-photo-upload" className="btn btn-light btn-sm position-absolute bottom-0 end-0 rounded-circle">
                      <FaCamera />
                    </label>
                    <input
                      id="profile-photo-upload"
                      type="file"
                      className="d-none"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </div>
                  <div className="ms-3">
                    <h1 className="h3 mb-0">{`${user.nombre} ${user.apellido}`}</h1>
                    <p className="mb-0 text-white">{user.especializacion}</p>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="account-info-card">
                      <div className="account-info-icon">
                        <FaCalendarAlt />
                      </div>
                      <div className="account-info-content">
                        <h6>Cuenta creada el</h6>
                        <p>{user.accountCreated}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="account-info-card">
                      <div className="account-info-icon">
                        <FaClock />
                      </div>
                      <div className="account-info-content">
                        <h6>Última actividad</h6>
                        <p>{user.lastLogin}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <ul className="nav nav-tabs mb-4">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'personal' ? 'active' : ''}`}
                      onClick={() => setActiveTab('personal')}
                    >
                      Información Personal
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
                      onClick={() => setActiveTab('security')}
                    >
                      Seguridad
                    </button>
                  </li>
                </ul>

                {activeTab === 'personal' && (
                  <form onSubmit={handleUpdateUser}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <div className="input-group">
                          <span className="input-group-text"><FaUser /></span>
                          <input
                            type="text"
                            className="form-control"
                            id="nombre"
                            value={user.nombre}
                            onChange={(e) => setUser({ ...user, nombre: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="apellido" className="form-label">Apellido</label>
                        <div className="input-group">
                          <span className="input-group-text"><FaUser /></span>
                          <input
                            type="text"
                            className="form-control"
                            id="apellido"
                            value={user.apellido}
                            onChange={(e) => setUser({ ...user, apellido: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label">Email</label>
                        <div className="input-group">
                          <span className="input-group-text"><FaEnvelope /></span>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="especializacion" className="form-label">Especialización</label>
                        <div className="input-group">
                          <span className="input-group-text"><FaGraduationCap /></span>
                          <input
                            type="text"
                            className="form-control"
                            id="especializacion"
                            value={user.especializacion}
                            onChange={(e) => setUser({ ...user, especializacion: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="responsabilidades" className="form-label">Responsabilidades</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaTasks /></span>
                        <textarea
                          className="form-control"
                          id="responsabilidades"
                          value={user.responsabilidades.join(", ")}
                          onChange={(e) => setUser({ ...user, responsabilidades: e.target.value.split(", ") })}
                          rows="3"
                          required
                        ></textarea>
                      </div>
                    </div>
                    <div className="text-end">
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Actualizando..." : "Guardar cambios"}
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'security' && (
                  <form onSubmit={handleUpdateUser}>
                    <div className="mb-3">
                      <label htmlFor="currentPassword" className="form-label">Contraseña actual</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaKey /></span>
                        <input
                          type="password"
                          className="form-control"
                          id="currentPassword"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="newPassword" className="form-label">Nueva contraseña</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaKey /></span>
                        <input
                          type="password"
                          className="form-control"
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">Confirmar nueva contraseña</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaKey /></span>
                        <input
                          type="password"
                          className="form-control"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <PasswordChecklist
                      rules={["minLength", "specialChar", "number", "capital", "match"]}
                      minLength={8}
                      value={newPassword}
                      valueAgain={confirmPassword}
                      onChange={(isValid) => setIsPasswordValid(isValid)}
                      messages={{
                        minLength: "La contraseña tiene al menos 8 caracteres.",
                        specialChar: "La contraseña tiene caracteres especiales.",
                        number: "La contraseña tiene un número.",
                        capital: "La contraseña tiene una letra mayúscula.",
                        match: "Las contraseñas coinciden.",
                      }}
                    />
                    <div className="d-flex justify-content-between align-items-center">
                      <button
                        type="button"
                        onClick={handleLogoutAllSessions}
                        className="btn btn-danger"
                      >
                        <FaSignOutAlt className="me-2" /> Cerrar sesiones en todos los dispositivos
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={isUpdating || (newPassword && !isPasswordValid)}
                      >
                        {isUpdating ? "Actualizando..." : "Guardar cambios"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvProfileSettings;