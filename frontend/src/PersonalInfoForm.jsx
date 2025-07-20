import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PersonalInfoForm.css';

export default function PersonalInfoForm() {
  const [photoPreview, setPhotoPreview] = useState(null);
  const navigate = useNavigate();
  const { id: perfilId } = useParams();

  const handleVolver = () => {
    navigate(`/menu/${perfilId}`);
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

          <form>
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
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setPhotoPreview(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="col-md-8">
                <div className="mb-3">
                  <label className="form-label">Nombre Completo</label>
                  <input type="text" className="form-control bg-light" />
                </div>

                <div className="row gx-5">
                  <div className="col-md-6 mb-3">
                    <label className="form-label nowrap-label">Fecha de nacimiento</label>
                    <input type="date" className="form-control bg-light date-input" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Sexo</label>
                    <select className="form-select bg-light">
                      <option>Selecciona</option>
                      <option>Masculino</option>
                      <option>Femenino</option>
                      <option>Otro</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Grupo RH</label>
                <select className="form-select bg-light">
                  <option>Selecciona</option>
                  <option>O+</option>
                  <option>O-</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Contacto emergencia</label>
                <input type="text" className="form-control bg-light" />
              </div>
            </div>

            <div className="d-flex justify-content-center gap-3 mt-4">
              <button type="submit" className="btn btn-save px-4">
                Guardar
              </button>
              <button
                type="button"
                className="btn btn-secondary px-4"
                onClick={handleVolver}
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
