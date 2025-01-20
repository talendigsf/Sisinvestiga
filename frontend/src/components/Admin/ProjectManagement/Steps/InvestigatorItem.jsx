import React from 'react';
import { Form } from 'react-bootstrap';
import noprofile from '../../../../assets/img/profile.png';

const InvestigatorItem = ({ investigador, isSelected, handleInvestigadorChange }) => {
  const { _id, nombre, apellido, fotoPerfil } = investigador;

  return (
    <div className="d-flex align-items-center mb-2">
      <img
        src={fotoPerfil || noprofile}
        alt={`${nombre} ${apellido}`}
        className="rounded-circle me-2 adm-edit-profile"
      />
      <Form.Check
        type="checkbox"
        id={`investigador-${_id}`}
        label={`${nombre} ${apellido}`}
        value={_id}
        checked={isSelected}
        onChange={(e) => handleInvestigadorChange(e, _id)}
      />
    </div>
  );
};

export default InvestigatorItem;