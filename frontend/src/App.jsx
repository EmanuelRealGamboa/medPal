import React from 'react';
import { Routes, Route, useParams, Navigate } from 'react-router-dom';
import SignIn from './signin.jsx';
import Signup from './signup.jsx';
import Verificacion from './verificacion.jsx';
import PerfilList from './PerfilList.jsx';
import PerfilForm from './PerfilForm.jsx';
import PerfilDetail from './PerfilDetail.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import MenuModulos from './MenuModulos.jsx';

import PersonalInfoView from './PersonalInfoView.jsx';
import PersonalInfoForm from './PersonalInfoForm.jsx';
import PersonalInfoEdit from './EditPersonalInfo.jsx';

export default function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<SignIn />} />
      <Route path="/signup" element={<Signup />} />

      {/* Verificación protegida */}
      <Route
        path="/verificacion"
        element={
          <ProtectedRoute requiresVerificationData={true}>
            <Verificacion />
          </ProtectedRoute>
        }
      />

      {/* Perfiles protegidos */}
      <Route
        path="/perfiles"
        element={
          <ProtectedRoute>
            <PerfilList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfiles/nuevo"
        element={
          <ProtectedRoute>
            <PerfilForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfiles/:id"
        element={
          <ProtectedRoute>
            <PerfilDetailWrapper />
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfiles/:id/editar"
        element={
          <ProtectedRoute>
            <PerfilFormWrapper />
          </ProtectedRoute>
        }
      />

      {/* Menú de módulos */}
      <Route
        path="/menu/:id"
        element={
          <ProtectedRoute>
            <MenuModulosWrapper />
          </ProtectedRoute>
        }
      />

      {/* Datos personales - rutas anidadas para view, add, edit */}
      <Route
        path="/menu/datos-personales"
        element={
          <ProtectedRoute>
            <PersonalInfoViewWrapper />
          </ProtectedRoute>
        }
      />
      <Route
        path="/menu/datos-personales/agregar"
        element={
          <ProtectedRoute>
            <PersonalInfoFormWrapper />
          </ProtectedRoute>
        }
      />
      <Route
        path="/menu/datos-personales/editar"
        element={
          <ProtectedRoute>
            <PersonalInfoEditWrapper />
          </ProtectedRoute>
        }
      />

      {/* Ruta fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

// Wrappers para pasar parámetros si se necesitan
function PerfilFormWrapper() {
  const { id } = useParams();
  return <PerfilForm perfilId={id} />;
}
function PerfilDetailWrapper() {
  const { id } = useParams();
  return <PerfilDetail perfilId={id} />;
}
function MenuModulosWrapper() {
  const { id } = useParams();
  return <MenuModulos perfilId={id} />;
}
function PersonalInfoViewWrapper() {
  return <PersonalInfoView />;
}
function PersonalInfoFormWrapper() {
  return <PersonalInfoForm />;
}
function PersonalInfoEditWrapper() {
  return <PersonalInfoEdit />;
}
