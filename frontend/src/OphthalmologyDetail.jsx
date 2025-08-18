// src/OphthalmologyDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OphthalmologyForm.css';

const OphthalmologyDetail = () => {
  const { perfilId, diagnosticoId } = useParams();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    perfil: '',
    exam_date: '',
    attention_type: '',
    diagnosis: '',
    notes: '',
    document: null,
  });

  const [patientName, setPatientName] = useState('');
  const [loading, setLoading] = useState(true);

  const attentionTypes = [
    { value: 'routine', label: 'Routine Check-up' },
    { value: 'followup', label: 'Chronic Condition Follow-up' },
    { value: 'postop', label: 'Postoperative' },
    { value: 'preventive', label: 'Preventive Screening' },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        // Traer datos del perfil
        const perfilRes = await axios.get(
          `http://127.0.0.1:8000/accounts/perfiles/${perfilId}/`,
          { headers: { Authorization: `Token ${token}` } }
        );
        setPatientName(perfilRes.data.nombre || 'Paciente');
        setFormData(prev => ({ ...prev, perfil: perfilId }));

        // Traer datos del diagnóstico
        if (diagnosticoId) {
          const diagRes = await axios.get(
            `http://127.0.0.1:8000/ophthalmology/diagnoses/${diagnosticoId}/`,
            { headers: { Authorization: `Token ${token}` } }
          );
          setFormData({
            perfil: perfilId,
            exam_date: diagRes.data.exam_date || '',
            attention_type: diagRes.data.attention_type || '',
            diagnosis: diagRes.data.diagnosis || '',
            notes: diagRes.data.notes || '',
            document: diagRes.data.document || null,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('No se pudieron cargar los datos del diagnóstico');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [perfilId, diagnosticoId, token]);

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Cargando información...</p>;
  }

  return (
    <div className="main-layout">
      <nav className="custom-navbar d-flex justify-content-between align-items-center px-4 py-2">
        <h4 className="text-light m-0">
          <i className="bi bi-person-circle me-2"></i>MedPal
        </h4>
        <button onClick={() => alert('Logout pressed')} className="btn btn-outline-light">
          Logout
        </button>
      </nav>

      <main className="form-section d-flex justify-content-center align-items-center py-4">
        <div className="form-card p-4 rounded shadow-sm custom-width">
          <h2 className="form-ophthalmology text-center mb-4">
            Detalle del diagnóstico oftalmológico
          </h2>

          <form className="ophthalmology-form">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label>Nombre completo:</label>
                  <input type="text" value={patientName} readOnly className="form-control" />
                </div>

                <div className="form-group mb-3">
                  <label>Exam Date:</label>
                  <input type="date" value={formData.exam_date} readOnly className="form-control" />
                </div>

                <div className="form-group mb-3">
                  <label>Attention Type:</label>
                  <input
                    type="text"
                    value={
                      attentionTypes.find(a => a.value === formData.attention_type)?.label || ''
                    }
                    readOnly
                    className="form-control"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label>Diagnosis:</label>
                  <textarea value={formData.diagnosis} readOnly className="form-control" />
                </div>

                <div className="form-group mb-3">
                  <label>Notes:</label>
                  <textarea value={formData.notes} readOnly className="form-control" />
                </div>

                <div className="form-group mb-3">
                  <label>Document:</label>
                  {formData.document ? (
                    <a
                      href={formData.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-block"
                    >
                      Ver documento
                    </a>
                  ) : (
                    <span className="text-muted">No hay documento</span>
                  )}
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-4">
              <button
                type="button"
                className="btn-save"
                onClick={() => navigate(`/menu/${perfilId}/oftalmologia`)}
              >
                Volver
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="custom-footer text-center text-light py-2">
        © 2025 MedPal
      </footer>
    </div>
  );
};

export default OphthalmologyDetail;
