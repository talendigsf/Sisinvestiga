import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutAllUser } from '../../../features/auth/authSlice';
import PasswordChecklist from 'react-password-checklist';
import { getUserData, putSelfData } from '../../../services/apiServices';
import AlertComponent from '../../../components/Common/AlertComponent';
import { FaUser, FaEnvelope, FaGraduationCap, FaTasks, FaKey, FaSignOutAlt, FaCamera, FaBell, FaLock } from 'react-icons/fa';
import '../../../css/Admin/AdmProfileSettings.css';

const AdmProfileSettings = () => {
  const [user, setUser] = useState({
    nombre: '',
    apellido: '',
    email: '',
    especializacion: '',
    responsabilidades: [],
    fotoPerfil: '',
    lastLogin: '',
    accountCreated: '',
  });
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: false,
    sms: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData('users');
        setUser({
          ...data,
          responsabilidades: data.responsabilidades || [],
          lastLogin: data.lastLogin ? new Date(data.lastLogin).toLocaleString() : 'Nunca',
          accountCreated: new Date(data.createdAt).toLocaleString(),
        });
      } catch (error) {
        AlertComponent.error('Error al cargar el perfil del administrador');
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
      AlertComponent.success('Perfil actualizado correctamente');
      setIsUpdating(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      let errorMessage = 'Error al actualizar el usuario.';
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
        navigate('/login');
      });
    } catch (error) {
      console.error('Error closing sessions on all devices:', error);
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

  const handleNotificationChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="admin-profile-container">
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <div className="position-relative d-inline-block mb-3">
                  <img
                    src={user.fotoPerfil || '/default-avatar.png'}
                    alt="Avatar"
                    className="rounded-circle admin-avatar"
                  />
                  <label htmlFor="admin-photo-upload" className="btn btn-primary btn-sm position-absolute bottom-0 end-0 rounded-circle">
                    <FaCamera />
                  </label>
                  <input
                    id="admin-photo-upload"
                    type="file"
                    className="d-none"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
                <h3 className="mb-0">{`${user.nombre} ${user.apellido}`}</h3>
                <p className="text-muted mb-3">Administrator</p>
                <div className="d-flex justify-content-center mb-3">
                  <button className="btn btn-outline-primary me-2">
                    <FaEnvelope className="me-2" />
                    Message
                  </button>
                  <button className="btn btn-outline-secondary">
                    <FaUser className="me-2" />
                    Profile
                  </button>
                </div>
                <div className="border-top pt-3">
                  <div className="row">
                    <div className="col">
                      <h6>Last Access</h6>
                      <p className="text-muted">{user.lastLogin}</p>
                    </div>
                    <div className="col">
                      <h6>Account Created</h6>
                      <p className="text-muted">{user.accountCreated}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <ul className="nav nav-tabs card-header-tabs">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'personal' ? 'active' : ''}`}
                      onClick={() => setActiveTab('personal')}
                    >
                      <FaUser className="me-2" />
                      Personal Information
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
                      onClick={() => setActiveTab('security')}
                    >
                      <FaLock className="me-2" />
                      Security
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
                      onClick={() => setActiveTab('notifications')}
                    >
                      <FaBell className="me-2" />
                      Notifications
                    </button>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                {activeTab === 'personal' && (
                  <form onSubmit={handleUpdateUser}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="nombre" className="form-label">Name</label>
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
                        <label htmlFor="apellido" className="form-label">Last Name</label>
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
                        <label htmlFor="especializacion" className="form-label">Specialization</label>
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
                      <label htmlFor="responsabilidades" className="form-label">Responsibilities</label>
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
                        className="btn btn-primary"
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
                      <label htmlFor="currentPassword" className="form-label">Current password</label>
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
                      <label htmlFor="newPassword" className="form-label">New password</label>
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
                      <label htmlFor="confirmPassword" className="form-label">Confirm new password</label>
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
                        minLength: "The password has at least 8 characters.",
                        specialChar: "The password has special characters.",
                        number: "The password has a number.",
                        capital: "The password has a capital letter.",
                        match: "The passwords match.",
                      }}
                    />
                    <div className="mb-3 mt-4">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="twoFactorAuth"
                          checked={twoFactorEnabled}
                          onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        />
                        <label className="form-check-label" htmlFor="twoFactorAuth">
                          Enable two-factor authentication
                        </label>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <button
                        type="button"
                        onClick={handleLogoutAllSessions}
                        className="btn btn-danger"
                      >
                        <FaSignOutAlt className="me-2" /> Sign out on all devices
                      </button>
                      <button
                        type="submit"
                        className="btn  btn-primary"
                        disabled={isUpdating || (newPassword && !isPasswordValid)}
                      >
                        {isUpdating ? "Updating..." : "Save changes"}
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'notifications' && (
                  <div>
                    <h5 className="mb-4">Notification preferences</h5>
                    <div className="mb-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="emailNotifications"
                          checked={notificationSettings.email}
                          onChange={() => handleNotificationChange('email')}
                        />
                        <label className="form-check-label" htmlFor="emailNotifications">
                          Email Notifications
                        </label>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="pushNotifications"
                          checked={notificationSettings.push}
                          onChange={() => handleNotificationChange('push')}
                        />
                        <label className="form-check-label" htmlFor="pushNotifications">
                          Push Notifications
                        </label>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="smsNotifications"
                          checked={notificationSettings.sms}
                          onChange={() => handleNotificationChange('sms')}
                        />
                        <label className="form-check-label" htmlFor="smsNotifications">
                          SMS Notifications
                        </label>
                      </div>
                    </div>
                    <div className="text-end mt-4">
                      <button type="button" className="btn btn-primary">
                        Save preferences
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmProfileSettings;
