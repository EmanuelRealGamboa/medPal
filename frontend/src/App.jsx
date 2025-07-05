import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignIn from './signin.jsx';
import Signup from './signup.jsx';
import Verificacion from './verificacion.jsx';
import Index from './index.jsx'; 
import ProtectedRoute from './ProtectedRoute.jsx';

export default function App() {
  return (
   <Routes>
  {/* Públicas */}
  <Route path="/" element={<SignIn />} />
  <Route path="/signup" element={<Signup />} />

  {/* Verificación protegida por correo temporal */}
  <Route
    path="/verificacion"
    element={
      <ProtectedRoute requiresVerificationData={true}>
        <Verificacion />
      </ProtectedRoute>
    }
  />

  {/* Rutas protegidas por token */}
  <Route
    path="/index"
    element={
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    }
  />
</Routes>
  );
}