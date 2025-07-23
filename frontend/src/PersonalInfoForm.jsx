import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PersonalInfoForm.css';

export default function PersonalInfoForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    fechaNacimiento: '',
    genero: '',
    grupoRH: '',
    contactoEmergencia: '',
    photoUser: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photoUser: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = new FormData();
    dataToSend.append('nombre', formData.nombre);
    dataToSend.append('fecha_nacimiento', formData.fechaNacimiento);
    dataToSend.append('genero', formData.genero);
    dataToSend.append('grupoRH', formData.grupoRH);
    dataToSend.append('contactoEmergencia', formData.contactoEmergencia);
    if (formData.photoUser) {
      dataToSend.append('photoUser', formData.photoUser);
    }

    const token = localStorage.getItem('token');

    try {
      await axios.post('http://127.0.0.1:8000/accounts/personal-data/', {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${token}`,
        },
      });
      navigate('/ver-datos-personales');
    } catch (error) {
      console.error('Error al guardar los datos:', error);
    }
  };

  return (
    <div className="main-layout">
      <header className="custom-navbar d-flex justify-content-between align-items-center px-4 py-2">
        <h4 className="text-light m-0">
          <i className="bi bi-person-circle me-2"></i>MedPal
        </h4>
      </header>

      <main className="form-section d-flex justify-content-center align-items-center">
        <div className="form-card p-4 rounded shadow-sm custom-width">
          <button className="close-btn">&times;</button>
          <h3 className="text-center mb-4">Datos personales</h3>

          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-4 mb-3">
                <label className="form-label">Foto de Perfil</label>
                <div className="photo-placeholder border rounded bg-light d-flex justify-content-center align-items-center flex-column">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Vista previa"
                      className="img-fluid rounded"
                      style={{ maxHeight: '120px', objectFit: 'cover' }}
                    />
                  ) : (
                    <i className="bi bi-person-circle fs-1 text-secondary"></i>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control mt-2"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="col-md-8">
                <div className="mb-3">
                  <label className="form-label">Nombre Completo</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="form-control bg-light"
                  />
                </div>

                <div className="row gx-5">
                  <div className="col-md-6 mb-3">
                    <label className="form-label nowrap-label">Fecha de nacimiento</label>
                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={formData.fechaNacimiento}
                      onChange={handleInputChange}
                      className="form-control bg-light date-input"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Género</label>
                    <select
                      name="genero"
                      value={formData.genero}
                      onChange={handleInputChange}
                      className="form-select bg-light"
                    >
                      <option value="">Selecciona</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Grupo RH</label>
                <select
                  name="grupoRH"
                  value={formData.grupoRH}
                  onChange={handleInputChange}
                  className="form-select bg-light"
                >
                  <option value="">Selecciona</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Contacto de emergencia</label>
                <input
                  type="text"
                  name="contactoEmergencia"
                  value={formData.contactoEmergencia}
                  onChange={handleInputChange}
                  className="form-control bg-light"
                />
              </div>
            </div>

            <div className="d-flex justify-content-center gap-3 mt-4">
              <button type="submit" className="btn btn-save px-4">
                Guardar
              </button>
              <button
                type="button"
                className="btn btn-secondary px-4"
                onClick={() => navigate('/modulos')}
              >
                Volver a módulos
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
