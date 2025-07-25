import React, { useState, useEffect } from 'react';
import './Ophthalmology.css';

const Ophthalmology = () => {
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [formData, setFormData] = useState({
    patient: '',
    exam_date: '',
    attention_type: '',
    diagnosis: '',
    notes: '',
    document: null,
  });

  const [errors, setErrors] = useState({});
  const [previewFileName, setPreviewFileName] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/patients/'); // ← Cambia esta URL si tu endpoint es diferente
        if (!response.ok) throw new Error('Error fetching patients');
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error('Error loading patients:', error);
      } finally {
        setLoadingPatients(false);
      }
    };

    fetchPatients();
  }, []);


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
          setErrors((prev) => ({ ...prev, document: 'Invalid file type. Allowed: JPG, PNG, PDF' }));
          setPreviewFileName('');
          return;
        } else if (file.size > 2 * 1024 * 1024) {
          setErrors((prev) => ({ ...prev, document: 'File exceeds 2MB size limit.' }));
          setPreviewFileName('');
          return;
        }
        setPreviewFileName(file.name);
        setFormData((prev) => ({ ...prev, document: file }));
        setErrors((prev) => ({ ...prev, document: null }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.patient || !formData.exam_date || !formData.diagnosis || !formData.document) {
      setErrors({ form: 'Please complete all required fields.' });
      return;
    }

    try {
      const data = new FormData();
      data.append('patient', formData.patient);
      data.append('exam_date', formData.exam_date);
      data.append('attention_type', formData.attention_type);
      data.append('diagnosis', formData.diagnosis);
      data.append('notes', formData.notes);
      data.append('document', formData.document);

      const response = await fetch('http://127.0.0.1:8000/ophthalmology/diagnoses/', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const formattedErrors = { form: 'Error saving data.' };

        // Copiar errores individuales si están presentes
        for (const field in errorData) {
          formattedErrors[field] = Array.isArray(errorData[field])
            ? errorData[field].join(' ')
            : errorData[field];
        }

        setErrors(formattedErrors);
        return;
      }

      alert('Diagnosis submitted successfully!');

      setFormData({
        patient: '',
        exam_date: '',
        attention_type: '',
        diagnosis: '',
        notes: '',
        document: null,
      });
      setPreviewFileName('');
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ form: 'Unexpected error submitting form.' });
    }
  };

  if (loadingPatients) {
    return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading patients...</p>;
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
                  <label htmlFor="patient">Patient:</label>
                  <select
                    name="patient"
                    value={formData.patient}
                    onChange={handleChange}
                    required
                    className="form-control"
                  >
                    <option value="">Select a patient</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>{p.email}</option>
                    ))}
                  </select>
                  {errors.patient && <p className="form-error">{errors.patient}</p>}
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

};

export default Ophthalmology;
