import axios from 'axios';

// // Constante de URL base para la API
// const API_URL = 'http://localhost:3005/api';
const API_URL = 'http://54.211.7.33:3005/api';

// Configuración inicial de Axios
const api = axios.create({
  baseURL: API_URL,
});

//  ------------------ Accesos al LocalStorage ------------------------ //

// Guardar token y rol en localStorage
export const saveSession = (token, role) => {
  if (!token || !role) {
    console.error("Token o rol no válidos o faltantes:", token, role);
    return false;
  }

  // Guarda el token y el rol en localStorage
  localStorage.setItem('ucsd_session', token);
  localStorage.setItem('role', role);
  return true;
};

// Borrar la sesión
export const deleteSession = () => {
  localStorage.removeItem('ucsd_session');
  localStorage.removeItem('role');
};

// Obtener la sesión desde localStorage
export const getSession = () => {
  const token = localStorage.getItem('ucsd_session');
  const role = localStorage.getItem('role');
  if (!token || !role) {
    return { token: null, role: null };
  }
  return { token, role };
};

// Interceptor para añadir el token en cada solicitud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ucsd_session');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Esto es para cuando el content type sea formdata o multi no de error
  if (config.data && config.data instanceof FormData) {
    // Dejar que Axios establezca el 'Content-Type' automáticamente para FormData
    delete config.headers['Content-Type'];
  } else {
    // Establecer 'Content-Type' como 'application/json' para otras solicitudes
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

//  -------------------------------- END ---------------------------- //

//  ------------------ Sesiones ------------------------ //

// Iniciar sesión
export const login = async (credentials) => {
  try {
    const response = await api.post('/users/login', credentials);
    const { user, token, role } = response.data; // Desestructuramos role y user de la respuesta

    if (!token || !role || !user) {
      throw new Error('El token, el rol o el usuario no se recibieron correctamente.');
    }

    // Guardar el token y el rol en localStorage
    saveSession(token, role);

    // Devuelve el token, el rol y el usuario al Redux
    return { user, token, role };
  } catch (error) {
    const errorMessage = error.response?.data?.error?.message || error.message || 'Error desconocido';
    throw new Error(errorMessage);
  }
};

// Cerrar sesión
export const logout = async () => {
  try {
    await api.post('/users/logout');
    deleteSession();
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Error desconocido';
    throw new Error(JSON.stringify(errorMessage));
  }
};

// Cerrar todas las sesiones
export const logoutAll = async () => {
  try {
    await api.post('/users/logout-all');
    deleteSession(); 
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Error desconocido';
    throw new Error(JSON.stringify(errorMessage));
  }
};

// Verify Email
export const verifyEmail = async (token) => {
  try {
    const response = await api.post(`/users/verify-email`, { token });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error?.message || error.message || 'Error desconocido';
    throw new Error(errorMessage);
  }
};

// Forgot Password
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/users/forgot-password', { email });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error?.message || error.message ;
    throw new Error(errorMessage);
  }
};

// Reset Password
export const resetPassword = async (token, password) => {
  try {
    const response = await api.post(`/users/reset-password/${token}`, { password });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error?.message || error.message ;
    throw new Error(errorMessage);
  }
};

//  -------------------------------- END ---------------------------- //

// GET
export const getData = async (endpoint) => {
  try {
    const response = await api.get(`/${endpoint}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Error desconocido';
    throw new Error(JSON.stringify(errorMessage));
  }
};

// GET con parámetros
export const getDataParams = async (endpoint, params = {}) => {
  try {
    const response = await api.get(`/${endpoint}`, { params });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Error desconocido';
    throw new Error(JSON.stringify(errorMessage));
  }
};

// Obtener un recurso por ID
export const getDataById = async (endpoint, id) => {
  try {
    const response = await api.get(`/${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Error desconocido';
    throw new Error(JSON.stringify(errorMessage));
  }
};

// Obtener recursos con búsqueda o filtro (ej: buscar proyectos)
export const searchData = async (endpoint, params) => {
  try {
    const response = await api.get(`/${endpoint}/search`, { params });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Error desconocido';
    throw new Error(JSON.stringify(errorMessage));
  }
};

// Obtener recursos personalizados (ej: obtener publicaciones del usuario)
export const getUserData = async (endpoint, params) => {
  try {
    const response = await api.get(`/${endpoint}/me`, { params });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Error desconocido';
    throw new Error(JSON.stringify(errorMessage));
  }
};

// GET
export const getFiles = async (endpoint, config = {}) => {
  try {
    const response = await api.get(`/${endpoint}`, config);
    return response;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Error desconocido';
    throw new Error(JSON.stringify(errorMessage));
  }
};

//  -------------------------------- END ---------------------------- //

// POST
export const postData = async (endpoint, body) => {
  try {
    const response = await api.post(`/${endpoint}`, body);
    return response.data;
  } catch (error) {
    // Capturamos y descomponemos el error según la estructura del backend
    const errorMessage = error.response?.data?.error?.message || error.message || 'Error desconocido';
    const detailedErrors = error.response?.data?.error?.errors || [];
    
    // Lanzamos el mensaje de error y los errores detallados si los hay
    throw new Error(JSON.stringify({ message: errorMessage, errors: detailedErrors }));
  }
};

//  -------------------------------- END ---------------------------- //

// PUT
export const putData = async (endpoint, id, body) => {
  try {
    const response = await api.put(`/${endpoint}/${id}`, body);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Error desconocido';
    throw new Error(JSON.stringify(errorMessage));
  }
};
//  -------------------------------- END ---------------------------- //

// PUT a tus propios datos
export const putSelfData = async (endpoint, body) => {
  try {
    const response = await api.put(`/${endpoint}/me`, body);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Error desconocido';
    throw new Error(JSON.stringify(errorMessage));
  }
};

//  -------------------------------- END ---------------------------- //

// DELETE
export const deleteData = async (endpoint, id) => {
  try {
    const response = await api.delete(`/${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Error desconocido';
    throw new Error(JSON.stringify(errorMessage));
  }
};

//  -------------------------------- END ---------------------------- //

// PATCH (actualizar parcialmente un recurso)
export const updateData = async (endpoint, id, body) => {
  try {
    const response = await api.patch(`/${endpoint}/${id}`, body);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Error desconocido';
    throw new Error(JSON.stringify(errorMessage));
  }
};
