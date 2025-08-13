// VaccinesForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './VaccinesForm.css';

export default function VaccinesForm() {
  const { perfilId, vacunaId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user: perfilId,
    vaccine_type: '',
    dose_number: 1,
    status: 'scheduled',
    scheduled_date: '',
    applied_date: '',
    healthcare_provider: '',
    doctor_name: '',
    batch_number: '',
    reaction: 'none',
    reaction_notes: '',
    notes: ''
  });
  const [vaccineTypes, setVaccineTypes] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchVaccineTypes() {
      try {
        const res = await axios.get('http://127.0.0.1:8000/vacunas/tipos/', {
          headers: { Authorization: `Token ${token}` }
        });
        setVaccineTypes(res.data);
      } catch (error) {
        console.error('Error al obtener tipos de vacuna:', error);
      }
    }

    async function fetchVaccineData() {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/vacunas/registros/${vacunaId}/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setFormData(res.data);
      } catch (error) {
        console.error('Error al obtener vacuna:', error);
      }
    }

    fetchVaccineTypes();
    if (vacunaId) fetchVaccineData();
  }, [vacunaId, token]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const headers = {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json'
      };

      const url = vacunaId
        ? `http://127.0.0.1:8000/vacunas/registros/${vacunaId}/`
        : 'http://127.0.0.1:8000/vacunas/registros/';

      const method = vacunaId ? 'put' : 'post';

      const payload = { ...formData, user: perfilId };

      await axios[method](url, payload, { headers });

      navigate(`/menu/${perfilId}/vacunas`);
    } catch (error) {
      console.error('Error al guardar vacuna:', error);
      alert('Ocurrió un error. Revisa la consola.');
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="custom-navbar d-flex justify-content-between align-items-center px-4 py-2">
        <h4 className="text-light m-0">
          <i className="bi bi-person-circle me-2"></i>MedPal
        </h4>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/signin';
          }}
          className="btn btn-outline-light"
        >
          Logout
        </button>
      </nav>

      <main className="form-section d-flex justify-content-center align-items-center py-4">
        <div className="form-card p-4 rounded shadow-sm custom-width">
          <h2 className="form-title text-center mb-4">
            {vacunaId ? 'Editar' : 'Agregar'} Vacuna
          </h2>

          <form onSubmit={handleSubmit} className="ophthalmology-form">
            <h3>Agregar Vacuna</h3>
            <div className="row">
              {/* Columna 1 */}
              <div className="col-md-3">
                <div className="form-group mb-3">
                  <label>Tipo de vacuna:</label>
                  <select
                    name="vaccine_type"
                    value={formData.vaccine_type}
                    onChange={handleChange}
                    className="form-control"
                    required
                  >
                    <option value="">Seleccione un tipo de vacuna</option>
                    {vaccineTypes.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label>Número de dosis:</label>
                  <input
                    type="number"
                    name="dose_number"
                    value={formData.dose_number}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Número de dosis"
                    min="1"
                    max="10"
                  />
                </div>
              </div>

              {/* Columna 2 */}
              <div className="col-md-3">
                <div className="form-group mb-3">
                  <label>Fecha programada:</label>
                  <input
                    type="date"
                    name="scheduled_date"
                    value={formData.scheduled_date || ''}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group mb-3">
                  <label>Fecha de aplicación:</label>
                  <input
                    type="date"
                    name="applied_date"
                    value={formData.applied_date || ''}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Columna 3 */}
              <div className="col-md-3">
                <div className="form-group mb-3">
                  <label>Proveedor de salud:</label>
                  <input
                    type="text"
                    name="healthcare_provider"
                    value={formData.healthcare_provider}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Proveedor de salud"
                  />
                </div>

                <div className="form-group mb-3">
                  <label>Nombre del médico:</label>
                  <input
                    type="text"
                    name="doctor_name"
                    value={formData.doctor_name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Nombre del médico"
                  />
                </div>
              </div>

              {/* Columna 4 */}
              <div className="col-md-3">
                <div className="form-group mb-3">
                  <label>Número de lote:</label>
                  <input
                    type="text"
                    name="batch_number"
                    value={formData.batch_number}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Número de lote"
                  />
                </div>

                <div className="form-group mb-3">
                  <label>Reacción:</label>
                  <select
                    name="reaction"
                    value={formData.reaction}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="none">Ninguna</option>
                    <option value="mild">Leve</option>
                    <option value="moderate">Moderada</option>
                    <option value="severe">Severa</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Textareas en ancho completo */}
            <div className="form-group mb-3">
              <label>Notas sobre reacciones:</label>
              <textarea
                name="reaction_notes"
                value={formData.reaction_notes}
                onChange={handleChange}
                className="form-control"
                placeholder="Notas sobre reacciones"
              />
            </div>

            <div className="form-group mb-3">
              <label>Observaciones generales:</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="form-control"
                placeholder="Observaciones generales"
              />
            </div>

            {/* Botones */}
            <div className="d-flex justify-content-end gap-3 mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(`/menu/${perfilId}/vacunas`)}
              >
                Volver a módulos
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
            </div>

          </form>
        </div>
      </main>


      {/* Footer */}
      <footer className="custom-footer text-center text-light py-2">
        © 2025 MedPal
      </footer>
    </>
  );
}
