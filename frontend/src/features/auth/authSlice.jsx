import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, logout, logoutAll, getSession, forgotPassword, resetPassword, verifyEmail    } from "../../services/apiServices";

const initialState = {
  user: null,
  token: null,
  role: null,
  error: null,
  success: null, 
  status: "idle",
  sessionLoaded: false,
};

// Cargar la sesión desde localStorage al iniciar la aplicación
export const loadSessionFromLocalStorage = () => {
  const { token, role } = getSession(); // Obtener token y rol desde localStorage
  if (token && role) {
    return {
      token,
      role,
    };
  }
  return {
    token: null,
    role: null,
  };
};

// Async thunk para el inicio de sesión
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await login(credentials);
      return response; // Retorna los datos del usuario
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Async thunk para verificar email
export const verifyUserEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token, thunkAPI) => {
    try {
      const response = await verifyEmail(token);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Async thunk para el cierre de sesión
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await logout();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error desconocido"
      );
    }
  }
);

// Async thunk para cerrar todas las sesiones
export const logoutAllUser = createAsyncThunk(
  "auth/logoutAllUser",
  async (_, thunkAPI) => {
    try {
      await logoutAll();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error desconocido");
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  'passwordReset/requestReset',
  async (email, thunkAPI) => {
    try {
      const response = await forgotPassword(email);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const confirmPasswordReset = createAsyncThunk(
  'passwordReset/confirmReset',
  async ({ token, password }, thunkAPI) => {
    try {
      const response = await resetPassword(token, password);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loadSession(state) {
      const session = loadSessionFromLocalStorage(); // Cargar desde localStorage
      state.token = session.token;
      state.role = session.role;
      state.sessionLoaded = true;  // Indicar que la sesión fue cargada
    },
    clearError(state) {
      state.error = null;
    },
    clearSuccess(state) {
      state.success = null; // Limpiar el mensaje de éxito
    },
    clearPasswordResetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.success = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.sessionLoaded = true;  // Establecer que la sesión está cargada
        state.success = 'Inicio de sesión exitoso'; 
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.success = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.role = null;
        state.sessionLoaded = true;  // Asegurarse de que la sesión se ha limpiado
        state.status = "idle";
      })
      .addCase(logoutAllUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.role = null;
        state.sessionLoaded = true;  // Asegurarse de que la sesión se ha limpiado
        state.status = "idle";
      })
      .addCase(logoutAllUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(verifyUserEmail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(verifyUserEmail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.success = action.payload.message;
      })
      .addCase(verifyUserEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(requestPasswordReset.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.status = 'succeeded';
        state.success = 'Se ha enviado un correo electrónico con instrucciones para restablecer su contraseña.';
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(confirmPasswordReset.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(confirmPasswordReset.fulfilled, (state) => {
        state.status = 'succeeded';
        state.success = 'Su contraseña ha sido restablecida con éxito.';
      })
      .addCase(confirmPasswordReset.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { loadSession, clearError, clearPasswordResetStatus } = authSlice.actions;

export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentRole = (state) => state.auth.role;
export const selectSessionLoaded = (state) => state.auth.sessionLoaded;

export default authSlice.reducer;
