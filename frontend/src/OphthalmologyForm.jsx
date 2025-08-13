import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './OphthalmologyForm.css';

const Ophthalmology = () => {
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [formData, setFormData] = useState({
    perfil: '',          // Aquí usamos perfil (id) para enviar al backend
    exam_date: '',
    attention_type: '',
    diagnosis: '',
    notes: '',
    document: null,
  });

  const [patientName, setPatientName] = useState(''); // Para mostrar nombre paciente
  const [errors, setErrors] = useState({});
  const [previewFileName, setPreviewFileName] = useState('');
  const navigate = useNavigate();
  const { perfilId } = useParams();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/accounts/perfiles/${perfilId}/`, {
          headers: { Authorization: `Token ${token}` },
        });

        const perfilData = res.data;
        // Ajusta según el campo que tengas para el nombre completo
        setPatientName(perfilData.nombre || 'Paciente');
        setFormData(prev => ({ ...prev, perfil: perfilId }));
      } catch (error) {
        console.error('Error fetching perfil:', error);
        setPatientName('Paciente');
        setFormData(prev => ({ ...prev, perfil: perfilId }));
      } finally {
        setLoadingPatients(false);
      }
    };

    if (perfilId) {
      fetchPerfil();
    }
  }, [perfilId, token]);

  const attentionTypes = [
    { value: 'routine', label: 'Routine Check-up' },
    { value: 'followup', label: 'Chronic Condition Follow-up' },
    { value: 'postop', label: 'Postoperative' },
    { value: 'preventive', label: 'Preventive Screening' },
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'document') {
      const file = files[0];
      if (file) {
        const ext = file.name.split('.').pop().toLowerCase();
        const validExts = ['jpg', 'jpeg', 'png', 'pdf'];
        if (!validExts.includes(ext)) {
          setErrors(prev => ({ ...prev, document: 'Invalid file type. Allowed: JPG, PNG, PDF' }));
          setPreviewFileName('');
          return;
        } else if (file.size > 2 * 1024 * 1024) {
          setErrors(prev => ({ ...prev, document: 'File exceeds 2MB size limit.' }));
          setPreviewFileName('');
          return;
        }
        setPreviewFileName(file.name);
        setFormData(prev => ({ ...prev, document: file }));
        setErrors(prev => ({ ...prev, document: null }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const form = new FormData();

    form.append('perfil', perfilId);
    form.append('patient_name', patientName); // Usa el nombre correcto
    form.append('exam_date', formData.exam_date);
    form.append('attention_type', formData.attention_type);
    form.append('diagnosis', formData.diagnosis);
    form.append('notes', formData.notes);
    if (formData.document) {
      form.append('document', formData.document);
    }

    try {
      await axios.post(
        'http://127.0.0.1:8000/ophthalmology/diagnoses/',
        form,
        {
          headers: {
            Authorization: `Token ${token}`,
            // No pongas 'Content-Type': 'application/json'
          }
        }
      );
      alert('Diagnosis submitted successfully!');

      setFormData({
        perfil: perfilId,
        exam_date: '',
        attention_type: '',
        diagnosis: '',
        notes: '',
        document: null,
      });
      setPreviewFileName('');
    } catch (error) {
      console.error('Submission error:', error);
      if (error.response?.data) {
        const errorData = error.response.data;
        const formattedErrors = { form: 'Error saving data.' };
        for (const field in errorData) {
          formattedErrors[field] = Array.isArray(errorData[field])
            ? errorData[field].join(' ')
            : errorData[field];
        }
        setErrors(formattedErrors);
      } else {
        setErrors({ form: 'Unexpected error submitting form.' });
      }
    }
  };

  if (loadingPatients) {
    return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading patient info...</p>;
  }

  return (
    <div className="main-layout">
      {/* Navbar */}
      <nav className="custom-navbar d-flex justify-content-between align-items-center px-4 py-2">
        <h4 className="text-light m-0">
          <i className="bi bi-person-circle me-2"></i>MedPal
        </h4>
        <button onClick={() => alert('Logout pressed')} className="btn btn-outline-light">
          Logout
        </button>
      </nav>

      {/* Formulario centrado */}
      <main className="form-section d-flex justify-content-center align-items-center py-4">
        <div className="form-card p-4 rounded shadow-sm custom-width">
          <h2 className="form-title text-center mb-4">Ophthalmology Diagnosis</h2>

          {errors.form && <p className="form-error">{errors.form}</p>}

          <form onSubmit={handleSubmit} className="ophthalmology-form">
            <div className="row">
              {/* Columna izquierda */}
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label>Nombre completo:</label>
                  <input
                    type="text"
                    name="patientName"
                    value={patientName}
                    disabled
                    className="form-control"
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="exam_date">Exam Date:</label>
                  <input
                    type="date"
                    name="exam_date"
                    value={formData.exam_date}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                  {errors.exam_date && <p className="form-error">{errors.exam_date}</p>}
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="attention_type">Attention Type:</label>
                  <select
                    name="attention_type"
                    value={formData.attention_type}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Select type</option>
                    {attentionTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  {errors.attention_type && <p className="form-error">{errors.attention_type}</p>}
                </div>
              </div>

              {/* Columna derecha */}
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label htmlFor="diagnosis">Diagnosis:</label>
                  <textarea
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                  {errors.diagnosis && <p className="form-error">{errors.diagnosis}</p>}
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="notes">Notes:</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="form-control"
                  />
                  {errors.notes && <p className="form-error">{errors.notes}</p>}
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="document">Document (JPG, PNG, PDF max 2MB):</label>
                  <input
                    type="file"
                    name="document"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                  {previewFileName && <p className="preview-filename">Selected file: {previewFileName}</p>}
                  {errors.document && <p className="form-error">{errors.document}</p>}
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-4">
              <button
                type="button"
                className="btn-save"
                onClick={() => navigate(`/menu/${perfilId}`)}
              >
                Volver a módulos
              </button>
              <button type="submit" className="btn-save">
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
    </div>
  );
};

export default Ophthalmology;
