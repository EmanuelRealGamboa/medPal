import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PersonalInfoForm.css';



export default function PersonalInfoForm() {

  const [photoPreview, setPhotoPreview] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="main-layout">
      {/* Navbar personalizada */}
      <nav className="custom-navbar d-flex justify-content-between align-items-center px-4 py-2">
        <h4 className="text-light m-0">
          <i className="bi bi-person-circle me-2"></i>MedPal
        </h4>
        <button onClick={handleLogout} className="btn btn-outline-light">
          Logout
        </button>
      </nav>

      {/* Contenido del formulario */}
      <main className="form-section d-flex justify-content-center align-items-center py-4">
        <div className="form-card p-4 rounded shadow-sm custom-width">
          <button className="close-btn">&times;</button>
          <h3 className="text-center mb-4">Datos personales</h3>

          <form>
            <div className="row mb-3">
              {/* Foto de perfil a la izquierda */}
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

              {/* Campos a la derecha */}
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

            <div className="d-flex justify-content-end gap-3 mt-4">
              <button type="button" className="btn-modulo">Volver a módulos</button>
              <button type="submit" className="btn-save">Guardar</button>
            </div>

          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="custom-footer text-center text-light py-2">
        © 2025 MedPal
      </footer>
    </div>
  );

}