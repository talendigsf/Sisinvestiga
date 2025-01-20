import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectCurrentToken, selectCurrentRole, selectSessionLoaded } from '../features/auth/authSlice';

const ProtectedRoute = ({ children, roles, redirectPath = '/unauthorized' }) => {
  const token = useSelector(selectCurrentToken);
  const role = useSelector(selectCurrentRole);
  const sessionLoaded = useSelector(selectSessionLoaded);

  if (!sessionLoaded) {
    return <p>Cargando sesión...</p>;
  }

  if (!token) {
    return <Navigate to='/login' />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to={redirectPath} />
  }

  return children;
};

export default ProtectedRoute;