import React from 'react';
import HitosSection from './HitosSection';
import RecursosSection from './RecursosSection';

const Step3 = ({
  formData,
  addHito,
  removeHito,
  handleHitoChange,
  addRecurso,
  removeRecurso,
  handleRecursoChange,
}) => {
  return (
    <>
      <HitosSection
        hitos={formData.hitos}
        addHito={addHito}
        removeHito={removeHito}
        handleHitoChange={handleHitoChange}
      />
      <RecursosSection
        recursos={formData.recursos}
        addRecurso={addRecurso}
        removeRecurso={removeRecurso}
        handleRecursoChange={handleRecursoChange}
      />
    </>
  );
};

export default Step3;