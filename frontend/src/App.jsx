import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import SignIn from './signin.jsx';
import Signup from './signup.jsx';
import Verificacion from './verificacion.jsx';
import PerfilList from './PerfilList.jsx';
import PerfilForm from './PerfilForm.jsx';
import PerfilDetail from './PerfilDetail.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import PersonalInfoForm from './PersonalInfoForm.jsx';
import MenuModulos from './MenuModulos.jsx';

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
      <Route
        path="/menu/:id"
        element={
          <ProtectedRoute>
            <MenuModulosWrapper />
          </ProtectedRoute>
        }
      />
      <Route
        path="/menu/:id/datos-personales"
        element={
          <ProtectedRoute>
            <PersonalInfoFormWrapper />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

// Wrappers para pasar ID por props
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

function PersonalInfoFormWrapper() {
  const { id } = useParams();
  return <PersonalInfoForm perfilId={id} />;
}
