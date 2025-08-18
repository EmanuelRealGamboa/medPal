import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';


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
import OphthalmologyDetail from "./OphthalmologyDetail.jsx";
import FormAlergias from './FormAlergias.jsx';
import FormHeredoFamiliares from './FormHeredoFamiliares.jsx';
import FormIntolerancias from './FormIntolerancias.jsx';
import FormPersonalesNoPatologicos from './FormPersonalesNoPatologicos.jsx';
import FormPersonalesPatologicos from './FormPersonalesPatologicos.jsx';
import EditarEliminarAlergia from './EditarEliminarAlergia.jsx';
import EditarEliminarIntolerancias from './EditarEliminarIntolerancias.jsx';
import EditDeletePersonalesNoPatologicos from './EditDeletePersonalesNoPatologicos.jsx';
import EditarEliminarHeredoFamiliares from './EditDeleteHeredoFamiliares.jsx';
import PrescriptionForm from './PrescriptionForm.jsx';
import PrescriptionList from './PrescriptionsList.jsx';
import EditarEliminarPersonalesPatologicos from './EditarEliminarPersonalesPatologicos.jsx';
import VaccinesView from './VaccinesView.jsx';
import VaccinesForm from './VaccinesForm.jsx';
import EditDeletGabinete from './EditDeletGabinete.jsx';
import GabineteList from './GabineteList.jsx';
import FormLaboratorio from './FormLaboratorio.jsx';
import EditDeletLaboratorio from './EditDeletLaboratorio.jsx';
import LaboratorioList from './LaboratorioList.jsx';
import FuncionalList from './FuncionalList.jsx'
import EditDeletFuncional from './EditDeletFuncional.jsx';
import VaccinesList from './VaccinesList.jsx';
import EditDeletVaccines from './EditDeletVaccines.jsx';
import AlertasView from './AlertasView.jsx'
import ModuloGineco from './ModuloGineco.jsx';
import ModuloEmbarazo from './ModuloEmbarazo.jsx';
import CalculadoraMenstrual from './CalculadoraMenstrual.jsx';
import NotasClinicasForm from './NotasClinicas.jsx';
import EmbarazoForm from './Embarazo.jsx';
import ConsultaEmbarazoForm from './ConsultaEmbarazo.jsx';
import PrediccionCiclo from './PrediccionCiclo.jsx';
import NotasClinicasView from './NotasClinicasView.jsx';
import EmbarazoView from './EmbarazoView.jsx';
import ConsultaEmbarazoView from './ConsultaEmbarazoView.jsx';
import ChronicList from './ChronicConditionList.jsx';
import ChronicConditionForm from './ChronicConditionForm.jsx';
import EstudioGabineteForm from './FormGabinete.jsx';
import EstudioFuncionalForm from './FormFuncional.jsx';
import EstudioView from './EstudioView.jsx';

// Wrappers para pasar ID como prop si el componente no usa useParams()
function PerfilFormWrapper() {
  const { perfilId } = useParams();
  return <PerfilForm perfilId={perfilId} />;
}

function PerfilDetailWrapper() {
  const { perfilId } = useParams();
  return <PerfilDetail perfilId={perfilId} />;
}

function PrescriptionFormWrapper() {
  const { id } = useParams();
  return <PrescriptionForm prescriptionId={id} />;
}


export default function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<SignIn />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/personalinform" element={<PersonalInfoForm />} />


    


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
      <Route path="/perfiles/:perfilId" element={<ProtectedRoute><PerfilDetailWrapper /></ProtectedRoute>} />
      <Route path="/perfiles/:perfilId/editar" element={<ProtectedRoute><PerfilFormWrapper /></ProtectedRoute>} />

      {/* Menú de módulos protegido */}
      <Route path="/menu/:perfilId" element={<ProtectedRoute><MenuModulos /></ProtectedRoute>} />

      {/* Datos personales */}
      <Route path="/menu/:perfilId/datos-personales" element={<ProtectedRoute><PersonalInfoView /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/datos-personales/agregar" element={<ProtectedRoute><PersonalInfoForm /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/datos-personales/editar" element={<ProtectedRoute><PersonalInfoForm /></ProtectedRoute>} />




      {/* Antecedentes médicos - Resumen */}
      <Route path="/menu/:perfilId/antecedentes-medicos" element={<ProtectedRoute><ResumenAntecedentes /></ProtectedRoute>} />


      {/* Estudios */}
      <Route path="/menu/:perfilId/estudios" element={<ProtectedRoute><EstudioView /></ProtectedRoute>} />
       

      {/* Rutas para formularios de estudios */}
      <Route path="/menu/:perfilId/estudios/gabinete" element={
        <ProtectedRoute>
          <EstudioGabineteForm />
        </ProtectedRoute>
      } />

      <Route path="/menu/:perfilId/estudios/funcional" element={
        <ProtectedRoute>
          <EstudioFuncionalForm />
        </ProtectedRoute>
      } />

     

    




      {/* Vacunas */}
      <Route path="/menu/:perfilId/vacunas" element={<ProtectedRoute><VaccinesView /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/vacunas/lista" element={<ProtectedRoute><VaccinesList /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/vacunas/agregar" element={<ProtectedRoute><VaccinesForm /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/vacunas/editar-eliminar/:id" element={<ProtectedRoute><EditDeletVaccines /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/vacunas/alertas" element={<ProtectedRoute><AlertasView /></ProtectedRoute>} />

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
      <Route path="/menu/:perfilId/antecedentes-medicos/patologicos/editar-eliminar/:id" element={<ProtectedRoute><EditarEliminarPersonalesPatologicos /></ProtectedRoute>} />
      {/* Oftalmología */}
      <Route path="/menu/:perfilId/oftalmologia" element={<ProtectedRoute><OphthalmologyView /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/oftalmologia/agregar" element={<ProtectedRoute><OphthalmologyForm /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/oftalmologia/editar/:diagnosticoId" element={<ProtectedRoute><OphthalmologyForm editMode /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/oftalmologia/detalle/:diagnosticoId"element={<OphthalmologyDetail />}/>


      {/* Rutas para formularios de estudios */}
      <Route path="/menu/:perfilId/estudios/laboratorio" element={<ProtectedRoute><FormLaboratorio /></ProtectedRoute>} />
     

      {/* Prescripciones */}
      <Route path="/menu/:perfilId/prescriptions" element={<ProtectedRoute><PrescriptionList /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/prescriptions/nuevo" element={<ProtectedRoute><PrescriptionForm /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/prescriptions/editar/:id" element={<ProtectedRoute><PrescriptionFormWrapper /></ProtectedRoute>} />



      {/* Edición/Eliminación específicas de Estudios */}
      <Route path="/menu/:perfilId/estudios/laboratorio/editar-eliminar/:id" element={<ProtectedRoute><EditDeletLaboratorio /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/estudios/laboratorio/lista" element={<ProtectedRoute><LaboratorioList /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/estudios/gabinete/editar-eliminar/:id" element={<ProtectedRoute><EditDeletGabinete /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/estudios/gabinete/lista" element={<ProtectedRoute><GabineteList /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/estudios/funcional/lista" element={<ProtectedRoute><FuncionalList /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/estudios/funcional/editar-eliminar/:id" element={<ProtectedRoute><EditDeletFuncional /></ProtectedRoute>} />

     

      {/* Gineco */}
      <Route path="/menu/:perfilId/Gineco" element={<ProtectedRoute><ModuloGineco /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/gineco/Modulos_Embarazo" element={<ProtectedRoute><ModuloEmbarazo /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/gineco/Modulos_Embarazo/notas-clinicas" element={<ProtectedRoute><NotasClinicasForm /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/gineco/Modulos_Embarazo/Datos_Embarazo" element={<ProtectedRoute><EmbarazoForm /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/gineco/Modulos_Embarazo/Consulta_Embarazo" element={<ProtectedRoute><ConsultaEmbarazoForm /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/gineco/Modulos_Embarazo/notas-clinicas/view/:notaId" element={<ProtectedRoute><NotasClinicasView /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/gineco/Modulos_Embarazo/Datos_Embarazo/view/:embarazoId" element={<ProtectedRoute><EmbarazoView /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/gineco/Modulos_Embarazo/Consulta_Embarazo/view/:consultaId" element={<ProtectedRoute><ConsultaEmbarazoView /></ProtectedRoute>} />


      {/* Calculadora menstrual */}
      <Route path="/menu/:perfilId/gineco/registro-menstrual" element={<ProtectedRoute><CalculadoraMenstrual /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/gineco/prediccion-ciclo" element={<ProtectedRoute><PrediccionCiclo /></ProtectedRoute>} />

      {/* Gineco */}
      <Route path="/menu/:perfilId/Enfermedades_Cronicas" element={<ProtectedRoute><ChronicList /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/Enfermedades_Cronicas/Agregar" element={<ProtectedRoute><ChronicConditionForm /></ProtectedRoute>} />
      <Route path="/menu/:perfilId/Enfermedades_Cronicas/Editar/:id"element={<ProtectedRoute><ChronicConditionForm /></ProtectedRoute>
        }
      />
      {/* Ruta fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}


function VaccinesViewWrapper() {
  const { id } = useParams();
  return <VaccinesView perfilId={id} />;
}

function VaccinesFormWrapper() {
  const { id, vacunaId } = useParams();
  return <VaccinesForm perfilId={id} vacunaId={vacunaId} />;
}


