import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

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
import ResumenAntecedentes from './ResumenAntecedentes.jsx';
import OphthalmologyView from './OphthalmologyView.jsx';
import OphthalmologyForm from './OphthalmologyForm.jsx';
import FormAlergias from './FormAlergias.jsx';
import FormHeredoFamiliares from './FormHeredoFamiliares.jsx';
import FormIntolerancias from './FormIntolerancias.jsx';
import FormPersonalesNoPatologicos from './FormPersonalesNoPatologicos.jsx';
import FormPersonalesPatologicos from './FormPersonalesPatologicos.jsx';
import EditarEliminarAlergia from './EditarEliminarAlergia.jsx';
import EditarEliminarIntolerancias from './EditarEliminarIntolerancias.jsx';
import EditDeletePersonalesNoPatologicos from './EditDeletePersonalesNoPatologicos.jsx';
import EditarEliminarHeredoFamiliares from './EditDeleteHeredoFamiliares.jsx';



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
      <Route path="/perfiles" element={<ProtectedRoute><PerfilList /></ProtectedRoute>} />
      <Route path="/perfiles/nuevo" element={<ProtectedRoute><PerfilForm /></ProtectedRoute>} />
      <Route path="/perfiles/:perfilId" element={<ProtectedRoute><PerfilDetail /></ProtectedRoute>} />
      <Route path="/perfiles/:perfilId/editar" element={<ProtectedRoute><PerfilForm /></ProtectedRoute>} />

      {/* Menú de módulos protegido */}
      <Route path="/menu/:perfilId" element={<ProtectedRoute><MenuModulos /></ProtectedRoute>} />

      {/* Datos personales */}
      <Route path="/menu/:perfilId/datos-personales" element={<ProtectedRoute><PersonalInfoView /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/datos-personales/agregar" element={<ProtectedRoute><PersonalInfoForm /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/datos-personales/editar" element={<ProtectedRoute><PersonalInfoEdit /></ProtectedRoute>} />

      {/* Antecedentes médicos - Resumen */}
      <Route path="/menu/:perfilId/antecedentes-medicos" element={<ProtectedRoute><ResumenAntecedentes /></ProtectedRoute>} />

      {/* Formularios de antecedentes médicos */}
      <Route path="/menu/:perfilId/antecedentes-medicos/alergias" element={<ProtectedRoute><FormAlergias /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/antecedentes-medicos/heredo-familiares" element={<ProtectedRoute><FormHeredoFamiliares /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/antecedentes-medicos/intolerancias" element={<ProtectedRoute><FormIntolerancias /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/antecedentes-medicos/no-patologicos" element={<ProtectedRoute><FormPersonalesNoPatologicos /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/antecedentes-medicos/patologicos" element={<ProtectedRoute><FormPersonalesPatologicos /></ProtectedRoute>} />

      {/* Edición/Eliminación específicas */}
      <Route path="/menu/:perfilId/antecedentes-medicos/alergias/editar-eliminar/:id" element={<ProtectedRoute><EditarEliminarAlergia /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/antecedentes-medicos/intolerancias/editar-eliminar/:intoleranciaId" element={<ProtectedRoute><EditarEliminarIntolerancias /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/antecedentes-medicos/no-patologicos/editar-eliminar/:id" element={<ProtectedRoute><EditDeletePersonalesNoPatologicos /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/antecedentes-medicos/heredo-familiares/editar-eliminar/:id" element={<ProtectedRoute><EditarEliminarHeredoFamiliares /></ProtectedRoute>} />
      
      {/* Oftalmología */}
      <Route path="/menu/:perfilId/oftalmologia" element={<ProtectedRoute><OphthalmologyView /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/oftalmologia/agregar" element={<ProtectedRoute><OphthalmologyForm /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/oftalmologia/editar/:diagnosticoId" element={<ProtectedRoute><OphthalmologyForm editMode /></ProtectedRoute>} />

      {/* Ruta fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
