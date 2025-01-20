import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router';
import ProtectedRoute from '../Context/ProtectedRoute';
import { selectSessionLoaded } from '../features/auth/authSlice';
import Home from '../views/Home/Home';
import LoginPage from '../views/auth/LoginPage';
import RegisterPage from '../views/auth/RegisterPage';
import AdminDashboard from '../views/Admin/AdminDashboard';
import InvestDashboardView from '../views/Investigator/InvestDashboardView';
import InvProjectsView from '../views/Investigator/ProjectViews/InvProjectsView';
import InvPublicationsView from '../views/Investigator/PublicationViews/InvPublicationsView';
import InvReportView from '../views/Investigator/ReportViews/InvReportView';
import InvRequestView from '../views/Investigator/RequestViews/InvRequestView';
import InvProfileView from '../views/Investigator/ProfileView/InvProfileView';
import Unauthorized from '../views/Pages/Unauthorized';
import NotFound from '../views/Pages/NotFound';
import AdmProjectsView from '../views/Admin/ProjectViews/AdmProjectsView';
import AdmEditProjectView from '../views/Admin/ProjectViews/AdmEditProjectView';
import AdmInvestigatorView from '../views/Admin/InvestigatorViews/AdmInvestigatorView'
import AdmPublicationViews from "../views/Admin/PublicationViews/AdmPublicationViews"
import ProjectDetailViews from '../views/Home/HomeProjects/ProjectDetailViews';
import PublicationDetailViews from '../views/Home/HomePublications/PublicationDetailViews';
import InvProjectAddView from '../views/Investigator/ProjectViews/InvProjectAddView';
import InvProjectDetailView from '../views/Investigator/ProjectViews/InvProjectDetailView';
import InvProjectEditView from '../views/Investigator/ProjectViews/InvProjectEditView';
import InvPublicationAddView from '../views/Investigator/PublicationViews/InvPublicationAddView';
import InvPublicationDetailsView from '../views/Investigator/PublicationViews/InvPublicationDetailsView';
import InvPublicationsEditView from '../views/Investigator/PublicationViews/InvPublicationsEditView';
import ForgotPasswordPage from '../views/auth/ForgotPasswordPage';
import ResetPasswordPage from '../views/auth/ResetPasswordPage';
import VerifyEmailPage from '../views/auth/VerifyEmailPage';
import AdmProfileView from '../views/Admin/ProfileView/AdmProfileView';
import InvEvaluationsView from '../views/Investigator/EvaluationViews/InvEvaluationsView';
import AdmEditPubView from '../views/Admin/PublicationViews/AdmEditPubView';
import AdminReportView from  '../views/Admin/ReportViews/AdminReportView';
import AdmEvaluationView from '../views/Admin/EvaluationViews/AdmEvaluationView';
import AdmRequestView from '../views/Admin/RequestViews/AdmRequestView';
import AdmRoleView from '../views/Admin/RoleViews/AdmRoleView';
import AdmAuditViews from '../views/Admin/AuditViews/AdmAuditViews';
import AdmEvaluationDetailViews from '../views/Admin/EvaluationViews/AdmEvaluationDetailViews';
import AdmRequestDetailViews from '../views/Admin/RequestViews/AdmRequestDetailViews';
import AdmNotificationViews from '../views/Admin/NotificationViews/AdmNotificationViews';
import InvNotificationsViews from '../views/Investigator/InvNotificationsViews';

const AppRouter = () => {

  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);
  const sessionLoaded = useSelector(selectSessionLoaded);

  if (!sessionLoaded) {
    return <p>Cargando sesión...</p>;
  }

  const getHome = () => {
    if (token) {
      switch (role) {
        case 'Administrador':
          return <Navigate to='/admin' />;
        case 'Investigador':
          return <Navigate to="/invest" />;      
        default:
          return <Home />;
      }
    }
    else {
      return <Home />;
    }
  }

  return (
    <Routes>
      {/* Rutas Publicas */}
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/verify-email' element={<VerifyEmailPage />} />
      <Route path='/forgot-password' element={<ForgotPasswordPage />} />
      <Route path='/reset-password/:token' element={<ResetPasswordPage />} />

      {/* Rutas Defecto de la pagina */}
      <Route path='/' element={getHome()} />
      <Route path='proyectos/:id' element={<ProjectDetailViews />} />
      <Route path='publicaciones/:id' element={<PublicationDetailViews />} />
      
      #region Ruta de los Investigadores
      {/* Rutas Protegidas para Investigador */}
      <Route path='/invest' element={ 
        <ProtectedRoute roles={['Investigador']}>
          <InvestDashboardView />
        </ProtectedRoute>
      } />

      <Route path='/invest/proyectos' element={
        <ProtectedRoute roles={['Investigador']}>
          <InvProjectsView />
        </ProtectedRoute>
      } />

      <Route path='/invest/detalles/proyecto/:id' element={
        <ProtectedRoute roles={['Investigador']}>
          <InvProjectDetailView />
        </ProtectedRoute>
      } />

      <Route path='/invest/proyectos/agregar' element={
        <ProtectedRoute roles={['Investigador']}>
          <InvProjectAddView />
        </ProtectedRoute>
      } />

      <Route path='/invest/proyectos/editar/:id' element={
        <ProtectedRoute roles={['Investigador']}>
          <InvProjectEditView />
        </ProtectedRoute>
      } />

      <Route path='/invest/publicaciones' element={
        <ProtectedRoute roles={['Investigador']}>
          <InvPublicationsView />
        </ProtectedRoute>
      } />

      <Route path='/invest/detalles/publicacion/:id' element={
        <ProtectedRoute roles={['Investigador']}>
          <InvPublicationDetailsView />
        </ProtectedRoute>
      } />

      <Route path='/invest/publicaciones/agregar' element={
        <ProtectedRoute roles={['Investigador']}>
          <InvPublicationAddView />
        </ProtectedRoute>
      } />

      <Route path='/invest/publicaciones/editar/:id' element={
        <ProtectedRoute roles={['Investigador']}>
          <InvPublicationsEditView />
        </ProtectedRoute>
      } />

      <Route path='/invest/informes' element={
        <ProtectedRoute roles={['Investigador']}>
          <InvReportView />
        </ProtectedRoute>
      } />

      <Route path='/invest/project/:projectId/evaluations' element={
        <ProtectedRoute roles={['Investigador']}>
          <InvEvaluationsView />
        </ProtectedRoute>
      } />

      <Route path='/invest/solicitudes' element={
        <ProtectedRoute roles={['Investigador']}>
          <InvRequestView />
        </ProtectedRoute>
      } />

      <Route path='/invest/notificaciones' element={
        <ProtectedRoute roles={['Investigador']}>
          <InvNotificationsViews />
        </ProtectedRoute>
      } />

      <Route path='/invest/perfil-investigador' element={
        <ProtectedRoute roles={['Investigador']}>
          <InvProfileView />
        </ProtectedRoute>
      } />
      #endregion

      #region Ruta de los Administradores
      {/* Rutas Protegidas para Administrador */}
      <Route path='/admin' element={ 
        <ProtectedRoute roles={['Administrador']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path='/admin/confprofile' element={ 
        <ProtectedRoute roles={['Administrador']}>
          <AdmProfileView />
        </ProtectedRoute>
      } />

      <Route path='/admin/gestionInvestigadores' element={ 
        <ProtectedRoute roles={['Administrador']}>
          <AdmInvestigatorView />
        </ProtectedRoute>
      } />

      <Route path='/admin/publicaciones' element={ 
        <ProtectedRoute roles={['Administrador']}>
          <AdmPublicationViews />
        </ProtectedRoute>
      } />

      <Route path='/admin/publicaciones/editar/:id' element={
        <ProtectedRoute roles={['Administrador']}>
          <AdmEditPubView />
        </ProtectedRoute>
      } />

      <Route path='/admin/listarproyectos' element={ 
        <ProtectedRoute roles={['Administrador']}>
          <AdmProjectsView />
        </ProtectedRoute>
      } />

      <Route path='/adm/proyectos/editar/:id' element={ 
        <ProtectedRoute roles={['Administrador']}>
          <AdmEditProjectView />
        </ProtectedRoute>
      } />

      <Route path='/admin/informes' element={
        <ProtectedRoute roles={['Administrador']}>
          <AdminReportView />
        </ProtectedRoute>
      } />

      <Route path='/admin/evaluationprojects' element={
        <ProtectedRoute roles={['Administrador']}>
          <AdmEvaluationView />
        </ProtectedRoute>
      } />

      <Route path='/admin/evaluationprojects/:projectId' element={
        <ProtectedRoute roles={['Administrador']}>
          <AdmEvaluationDetailViews />
        </ProtectedRoute>
      } />

      <Route path='/admin/solicitudes' element={
        <ProtectedRoute roles={['Administrador']}>
          <AdmRequestView />
        </ProtectedRoute>
      } />

      <Route path='/admin/solicitudes/:id' element={
        <ProtectedRoute roles={['Administrador']}>
          <AdmRequestDetailViews />
        </ProtectedRoute>
      } />

      <Route path='/admin/roles' element={
        <ProtectedRoute roles={['Administrador']}>
          <AdmRoleView />
        </ProtectedRoute>
      } />

      <Route path='/admin/auditoria' element={
        <ProtectedRoute roles={['Administrador']}>
          <AdmAuditViews />
        </ProtectedRoute>
      } />

      <Route path='/admin/notificaciones' element={
        <ProtectedRoute roles={['Administrador']}>
          <AdmNotificationViews />
        </ProtectedRoute>
      } />

      #endregion

      {/* Rutas Protegidas no Autorizado */}
      <Route path='/unauthorized' element={<Unauthorized />} />

      {/* Ruta por defecto: Not Found */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter;
