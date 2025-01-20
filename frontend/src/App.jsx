import React, { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { Provider, useDispatch } from "react-redux";
import store from "./store";
import { loadSession } from "./features/auth/authSlice"; // Importar la acción de carga de sesión
import { NotificationsProvider } from './Context/NotificationsProvider';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Cargar el token y rol desde localStorage al iniciar la aplicación
    dispatch(loadSession());
  }, [dispatch]);

  return <AppRouter />;
}

const AppWrapper = () => (
  <Provider store={store}>
    <NotificationsProvider>
      <App />
    </NotificationsProvider>
  </Provider>
);

export default AppWrapper;
