import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PrescriptionList.css';

export default function PrescriptionsList() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [specialties, setSpecialties] = useState(['Todas']);
  const [selectedSpecialty, setSelectedSpecialty] = useState('Todas');
  const [showModal, setShowModal] = useState(false);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  useEffect(() => {
    if (selectedSpecialty === 'Todas') {
      setFilteredPrescriptions(prescriptions);
    } else {
      setFilteredPrescriptions(
        prescriptions.filter(p => p.specialty === selectedSpecialty)
      );
    }
  }, [selectedSpecialty, prescriptions]);

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://127.0.0.1:8000/prescriptions/prescriptions/', {
        headers: { 
          Authorization: `Token ${localStorage.getItem('token')}` 
        }
      });
      setPrescriptions(response.data);
      
      const uniqueSpecialties = [...new Set(response.data.map(p => p.specialty))];
      setSpecialties(['Todas', ...uniqueSpecialties]);
    } catch (error) {
      console.error("Error al cargar recetas:", error);
      if (error.response?.status === 401) {
        handleLogout();
        setError('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
      } else {
        setError('Error al cargar las recetas. Intenta nuevamente más tarde.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDelete = (id) => {
    setPrescriptionToDelete(id);
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/prescriptions/prescriptions/${prescriptionToDelete}/`, {
        headers: { 
          Authorization: `Token ${localStorage.getItem('token')}` 
        }
      });
      setPrescriptions(prescriptions.filter(p => p.id !== prescriptionToDelete));
      setShowModal(false);
    } catch (error) {
      console.error("Error al eliminar receta:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="prescription-bg">
      <nav className="custom-navbar d-flex justify-content-between align-items-center px-4 py-2">
        <h4 className="text-light m-0">
          MedPal - Recetas Médicas 
        </h4>
        <div>
          <button
            onClick={() => navigate('/prescriptions/nuevo')}
            className="btn btn-outline-light me-2"
          >
            <i className="bi bi-plus-circle"></i> Nueva Receta
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/');
            }}
            className="btn btn-outline-light"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="prescription-container">
        <div className="filter-section">
          <div className="filter-group">
            <label htmlFor="specialty-filter">Filtrar por especialidad:</label>
            <select
              id="specialty-filter"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
          <span className="prescription-count">
            {filteredPrescriptions.length} {filteredPrescriptions.length === 1 ? 'receta' : 'recetas'}
          </span>
        </div>

        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando recetas médicas...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <i className="bi bi-exclamation-triangle"></i>
            <p>{error}</p>
            {error.includes('sesión') && (
              <button 
                onClick={() => navigate('/login')}
                className="btn-login"
              >
                Ir a inicio de sesión
              </button>
            )}
          </div>
        ) : filteredPrescriptions.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-file-earmark-medical"></i>
            <h5>No hay recetas {selectedSpecialty !== 'Todas' ? `de ${selectedSpecialty}` : 'disponibles'}</h5>
          </div>
        ) : (
          <div className="prescription-grid-container">
            <div className="prescription-grid">
              {filteredPrescriptions.map((prescription) => (
                <div key={prescription.id} className="prescription-card">
                  <div className="card-header">
                    <h5>{prescription.prescribing_doctor}</h5>
                    <span className="specialty-badge">
                      {prescription.specialty}
                    </span>
                  </div>
                  
                  <div className="card-body">
                    <div className="card-field">
                      <span className="field-label">Institución: </span>
                      <span className="field-value">{prescription.institution}</span>
                    </div>
                    
                    <div className="card-field">
                      <span className="field-label">Fecha: </span>
                      <span className="field-value">{formatDate(prescription.issue_date)}</span>
                    </div>
                    
                    <div className="card-field">
                      <span className="field-label">Medicamentos:</span>
                      <div className="medications-list">
                        {prescription.medications.split('\n').map((med, i) => (
                          <span key={i} className="medication-item">
                            {med.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="card-field">
                      <span className="field-label">Notas: </span>
                      <p className="field-value">{prescription.description}</p>
                    </div>
                    
                    {prescription.file && (
                    <div className="mt-2">
                      <a 
                        href={prescription.file} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        <i className="bi bi-file-earmark-medical"></i> Ver documento
                      </a>
                    </div>
                  )}
                </div>

                  
                  <div className="card-footer">
                  <button 
                    onClick={() => navigate(`/prescriptions/editar/${prescription.id}`)}
                    className="btn btn-sm btn-outline-secondary me-2"
                  >
                    <i className="bi bi-pencil"></i> Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(prescription.id)}
                    className="btn btn-sm btn-outline-danger"
                  >
                    <i className="bi bi-trash"></i> Eliminar
                  </button>
                </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar eliminación</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas eliminar esta receta médica?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={handleDeleteConfirm}>
                  Sí, eliminar
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