import React, { useState, useEffect } from 'react';
import '../../../css/Admin/AdmInvestigatorView.css';

const AdmEditInvestigator = ({ investigador, roles, onSave, onUpdateRole, onCancel }) => {
  const [editedUser, setEditedUser] = useState(() => ({
    ...investigador,
  }));

  useEffect(() => {
    setEditedUser({
      ...investigador,
    });
  }, [investigador]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedUser);
  };

  const handleRoleChange = (e) => {
    const roleId = e.target.value; 
    onUpdateRole(editedUser._id, roleId);
    setEditedUser((prev) => ({
      ...prev,
      role: { _id: roleId, roleName: roles.find((r) => r._id === roleId)?.roleName },
    }));
  };

  return (
    <div className="editar-investigador">
      <h2>Editar Investigador</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            name="nombre"
            value={editedUser.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="apellido">Apellido:</label>
          <input
            type="text"
            className="form-control"
            id="apellido"
            name="apellido"
            value={editedUser.apellido}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={editedUser.email}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="especializacion">Especialización:</label>
          <input
            type="text"
            className="form-control"
            id="especializacion"
            name="especializacion"
            value={editedUser.especializacion}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Rol:</label>
          <select
            className="form-control"
            id="role"
            name="role"
            value={editedUser.role?._id || editedUser.role}
            onChange={handleRoleChange}
            required
          >
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.roleName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="responsabilidades">Responsabilidades:</label>
          <textarea
            className="form-control"
            id="responsabilidades"
            name="responsabilidades"
            value={editedUser.responsabilidades.join(', ')}
            onChange={(e) =>
              setEditedUser((prev) => ({
                ...prev,
                responsabilidades: e.target.value.split(',').map((r) => r.trim()),
              }))
            }
            required
          />
        </div>
        <div className="form-group">
          <label>
            Fecha de Creación: {new Date(editedUser.createdAt).toLocaleString()}
          </label>
        </div>
        <div className="form-group">
          <label>
            Última Actualización: {new Date(editedUser.updatedAt).toLocaleString()}
          </label>
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            Guardar
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdmEditInvestigator