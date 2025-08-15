import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PersonalInfoForm.css';
import './PersonalInfoView.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PersonalInfoView() {
  const navigate = useNavigate();
  const { perfilId } = useParams();
  const token = localStorage.getItem('token');
  const [formData, setFormData] = useState({
    nombre: '',
    fechaNacimiento: '',
    genero: '',
    grupoRH: '',
    contactoEmergencia: '',
    nombreContactoEmergencia: '',
    photoUser: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!token || !perfilId) {
        setLoading(false);
        return;
      }
  
      try {
        // Obtener datos del perfil
        const perfilRes = await axios.get(
          `http://127.0.0.1:8000/accounts/perfiles/${perfilId}/`,
          { headers: { Authorization: `Token ${token}` } }
        );
        const perfilData = perfilRes.data;
  
        // Obtener datos del usuario/personal
        const personalRes = await axios.get(
          `http://127.0.0.1:8000/accounts/personal-data/?perfil=${perfilId}`,
          { headers: { Authorization: `Token ${token}` } }
        );
        
        console.log('Respuesta personalRes.data:', personalRes.data);
        
  
        // Extraer personal_data del UserSerializer
        const personalData = personalRes.data.personal_data || {};
  
        // Ajustar los campos para setFormData
        setFormData({
          nombre: `${personalRes.data.name || ''} ${personalRes.data.apellido_paterno || ''} ${personalRes.data.apellido_materno || ''}`.trim(),
          fechaNacimiento: personalData.fecha_nacimiento || perfilData.fecha_nacimiento || '',
          genero: personalData.genero || '',
          grupoRH: personalData.grupoRH || '',
          contactoEmergencia: personalRes.data.phone || '',
          nombreContactoEmergencia: `${personalRes.data.name || ''} ${personalRes.data.apellido_paterno || ''} ${personalRes.data.apellido_materno || ''}`.trim(),
          photoUser: personalRes.data.photoUser || null,
        });
  
        // Foto para preview
        setPhotoPreview(personalRes.data.photoUser || null);
  
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchData();
  }, [perfilId, token]);
  
  
  
  
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleEdit = () => {
    navigate(`/menu/${perfilId}/datos-personales/editar`);
  };

  if (loading) {
    return <div className="text-center py-5">Cargando datos...</div>;
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="custom-navbar d-flex justify-content-between align-items-center px-4 py-2">
        <h4 className="text-light m-0">
          <i className="bi bi-person-circle me-2"></i>MedPal
        </h4>
        <button onClick={handleLogout} className="btn btn-outline-light">Logout</button>
      </nav>

      {/* Vista de datos personales */}
      <section className="content-section">
        <div className="card">
          <h3 className="text-center mb-4">Datos Personales</h3>
          <div className="row mb-3">
            {/* Foto */}
            <div className="col-md-4 mb-3">
              <label className="form-label data-label">Foto de Perfil</label>
              <div className="photo-placeholder border rounded bg-light d-flex justify-content-center align-items-center flex-column">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Foto de perfil"
                    className="img-fluid rounded"
                    style={{ maxHeight: '120px', objectFit: 'cover' }}
                  />
                ) : (
                  <i className="bi bi-person-circle fs-1 text-secondary"></i>
                )}
              </div>
            </div>

            <div className="col-md-8">
              <div className="data-field mb-3">
                <span className="data-label">Nombre Completo:</span>
                <span className="data-value">{formData.nombre}</span>
              </div>
              <div className="row gx-5">
                <div className="col-md-6 data-field mb-3">
                  <span className="data-label">Fecha de nacimiento:</span>
                  <span className="data-value">{formData.fechaNacimiento}</span>
                </div>
                <div className="col-md-6 data-field mb-3">
                  <span className="data-label">Género:</span>
                  <span className="data-value">{formData.genero}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <div className="data-field">
                <span className="data-label">Grupo RH:</span>
                <span className="data-value">{formData.grupoRH}</span>
              </div>
              <div className="data-field mt-3">
                <span className="data-label">Teléfono:</span>
                <span className="data-value">{formData.contactoEmergencia}</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="data-field">
                <span className="data-label">Contacto de Emergencia:</span>
                <span className="data-value">{formData.nombreContactoEmergencia}</span>
              </div>
            </div>
          </div>

          <div className="btn-container">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleEdit}
            >
              Editar
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/menu/${perfilId}/datos-personales/editar`)}
            >
              Volver
            </button>
          </div>
        </div>
      </section>

      <footer className="footer-bar">
        © 2025 MedPal
      </footer>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}
