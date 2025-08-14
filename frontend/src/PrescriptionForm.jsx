import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './PrescriptionForm.css';

export default function PrescriptionForm() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    issue_date: '',
    institution: '',
    prescribing_doctor: '',
    specialty: '',
    description: '',
    medications: '',
    file: null,
  });

  const [currentFile, setCurrentFile] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    issue_date: false,
    institution: false,
    prescribing_doctor: false,
    specialty: false,
    medications: false,
    file: false
  });
  
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      const fetchPrescription = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/prescriptions/prescriptions/${id}/`,
            {
              headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
              },
            }
          );
          setFormData({
            issue_date: response.data.issue_date,
            institution: response.data.institution,
            prescribing_doctor: response.data.prescribing_doctor,
            specialty: response.data.specialty,
            description: response.data.description || '',
            medications: response.data.medications,
            file: null,
          });
          setCurrentFile(response.data.file);
        } catch (error) {
          console.error('Error al cargar receta:', error);
          setError(`No se pudo cargar la receta médica: ${error.response?.data?.detail || ''}`);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPrescription();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setValidationErrors(prev => ({
      ...prev,
      [name]: !value
    }));
  };

  const validateForm = () => {
    const errors = {
      issue_date: !formData.issue_date,
      institution: !formData.institution,
      prescribing_doctor: !formData.prescribing_doctor,
      specialty: !formData.specialty,
      medications: !formData.medications,
      file: !isEdit && !formData.file
    };
    
    setValidationErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const prepareFormData = () => {
    const data = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        if (key === 'file') {
          if (value instanceof File) {
            data.append(key, value);
          }
        } else {
          data.append(key, value);
        }
      }
    });

    if (isEdit && currentFile && !formData.file) {
      data.append('keep_existing_file', 'true');
    }
    
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    if (isEdit) {
      setShowConfirmModal(true);
    } else {
      await submitForm();
    }
  };

  const submitForm = async () => {
    const data = prepareFormData();
    
    try {
      setIsLoading(true);
      setShowConfirmModal(false);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      };

      let response;
      if (isEdit) {
        response = await axios.patch(
          `http://127.0.0.1:8000/prescriptions/prescriptions/${id}/`,
          data,
          config
        );
      } else {
        response = await axios.post(
          'http://127.0.0.1:8000/prescriptions/prescriptions/',
          data,
          config
        );
      }

      if (response.status === 200 || response.status === 201) {
        setShowSuccessModal(true);
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (error) {
      console.error('Error al guardar receta:', error);
      let errorMessage = 'Error al guardar la receta médica. Intente nuevamente.';
      
      if (error.response) {
        if (error.response.data) {
          if (typeof error.response.data === 'object') {
            errorMessage = Object.entries(error.response.data)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
              .join('\n');
          } else {
            errorMessage = error.response.data.toString();
          }
        }
      } else if (error.request) {
        errorMessage = 'No se recibió respuesta del servidor. Verifique su conexión.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEdit && !showConfirmModal) {
    return (
      <div className="prescription-form-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando receta médica...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="prescription-form-container">
      <nav className="custom-navbar d-flex justify-content-between align-items-center px-4 py-2">
        <h4 className="text-light m-0">MedPal</h4>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/');
          }}
          className="btn btn-outline-light"
        >
          Logout
        </button>
      </nav>

      <div className="prescription-form-container">
        <form className="prescription-form" onSubmit={handleSubmit}>
          <h1>{isEdit ? 'Editar Receta Médica' : 'Nueva Receta Médica'}</h1>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="form-grid-container">
            <div className="field-group">
              <label>Fecha de emisión *</label>
              <input
                type="date"
                name="issue_date"
                value={formData.issue_date}
                onChange={handleChange}
                onBlur={handleBlur}
                className={validationErrors.issue_date ? 'error' : ''}
                disabled={isLoading}
              />
              {validationErrors.issue_date && (
                <span className="error-message">Este campo es requerido</span>
              )}
            </div>

            <div className="field-group">
              <label>Institución *</label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                onBlur={handleBlur}
                className={validationErrors.institution ? 'error' : ''}
                disabled={isLoading}
              />
              {validationErrors.institution && (
                <span className="error-message">Este campo es requerido</span>
              )}
            </div>

            <div className="field-group">
              <label>Médico que prescribe *</label>
              <input
                type="text"
                name="prescribing_doctor"
                value={formData.prescribing_doctor}
                onChange={handleChange}
                onBlur={handleBlur}
                className={validationErrors.prescribing_doctor ? 'error' : ''}
                disabled={isLoading}
              />
              {validationErrors.prescribing_doctor && (
                <span className="error-message">Este campo es requerido</span>
              )}
            </div>

            <div className="field-group">
              <label>Especialidad *</label>
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                onBlur={handleBlur}
                className={validationErrors.specialty ? 'error' : ''}
                disabled={isLoading}
              />
              {validationErrors.specialty && (
                <span className="error-message">Este campo es requerido</span>
              )}
            </div>
          </div>

          <div className="field-group full-width-field">
            <label>Medicamentos (uno por línea) *</label>
            <textarea
              name="medications"
              value={formData.medications}
              onChange={handleChange}
              onBlur={handleBlur}
              className={validationErrors.medications ? 'error' : ''}
              disabled={isLoading}
            />
            {validationErrors.medications && (
              <span className="error-message">Este campo es requerido</span>
            )}
          </div>

          <div className="field-group full-width-field">
            <label>Notas</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="field-group full-width-field">
            <label>Documento (PDF o imagen máx. 2 MB) {!isEdit && '*'}</label>
            <div className={`file-input-container ${validationErrors.file ? 'error' : ''}`}>
              <input
                type="file"
                name="file"
                onChange={handleChange}
                onBlur={() => setValidationErrors(prev => ({
                  ...prev,
                  file: !isEdit && !formData.file
                }))}
                disabled={isLoading}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              
              {isEdit && currentFile && (
                <div className="current-file-info">
                  <p>
                    <i className="bi bi-file-earmark"></i> Archivo actual: 
                    <a 
                      href={currentFile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="file-link"
                    >
                      {currentFile.split('/').pop()}
                    </a>
                  </p>
                  <small className="text-muted">
                    Seleccione un nuevo archivo solo si desea reemplazar el actual
                  </small>
                </div>
              )}
              
              {validationErrors.file && (
                <span className="error-message">
                  {isEdit ? 'Seleccione un archivo si desea reemplazar el actual' : 'Debe seleccionar un archivo'}
                </span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/prescriptions')}
              disabled={isLoading}
            >
              {isLoading ? 'Cancelando...' : 'Volver'}
            </button>

            <button
              type="submit"
              className="btn btn-secondary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  {isEdit ? ' Actualizando...' : ' Guardando...'}
                </>
              ) : (
                isEdit ? 'Actualizar Receta' : 'Guardar Receta'
              )}
            </button>
          </div>
        </form>
      </div>

      {showConfirmModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar actualización</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isLoading}
                ></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas actualizar esta receta médica?</p>
                <p className="text-muted">Se actualizarán todos los campos del formulario.</p>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn-consistent" 
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-consistent" 
                  onClick={submitForm}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Actualizando...
                    </>
                  ) : (
                    'Sí, actualizar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-success">
                  ¡Receta {isEdit ? 'actualizada' : 'creada'} con éxito!
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/prescriptions');
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>La receta ha sido {isEdit ? 'actualizada' : 'creada'} correctamente.</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn-consistent"
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/prescriptions');
                  }}
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="custom-footer text-center text-light py-2">
        © 2025 MedPal
      </footer>
    </div>
  );
}