import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PrescriptionList.css';
import { useNavigate, useParams } from 'react-router-dom';



export default function PrescriptionsList() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [specialties, setSpecialties] = useState(['Todas']);
  const [selectedSpecialty, setSelectedSpecialty] = useState('Todas');
  const [showModal, setShowModal] = useState(false);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState(null);
  const { perfilId } = useParams();

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
      const response = await axios.get(
        'http://127.0.0.1:8000/prescriptions/prescriptions/',
        {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` }
        }
      );
      setPrescriptions(response.data);

      const uniqueSpecialties = [...new Set(response.data.map(p => p.specialty))];
      setSpecialties(['Todas', ...uniqueSpecialties]);
    } catch (err) {
      console.error("Error al cargar recetas:", err);
      if (err.response?.status === 401) {
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
      await axios.delete(
        `http://127.0.0.1:8000/prescriptions/prescriptions/${prescriptionToDelete}/`,
        { headers: { Authorization: `Token ${localStorage.getItem('token')}` } }
      );
      setPrescriptions(prescriptions.filter(p => p.id !== prescriptionToDelete));
      setShowModal(false);
    } catch (err) {
      console.error("Error al eliminar receta:", err);
      if (err.response?.status === 401) handleLogout();
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="prescription-bg">
      <nav className="custom-navbar d-flex justify-content-between align-items-center px-4 py-2">
        <h4 className="text-light m-0">MedPal - Recetas Médicas</h4>
        <div>
        <button
  onClick={() => navigate(`/menu/${perfilId}/prescriptions/nuevo`)}
  className="btn btn-outline-light me-2"
>
  <i className="bi bi-plus-circle"></i> Nueva Receta
</button>


          <button onClick={handleLogout} className="btn btn-outline-light">
            Logout
          </button>
        </div>
      </nav>

      <div className="prescription-container">
        <div className="filter-section">
          <label htmlFor="specialty-filter">Filtrar por especialidad:</label>
          <select
            id="specialty-filter"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            {specialties.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
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
              <button onClick={() => navigate('/login')} className="btn-login">
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
            {filteredPrescriptions.map((p) => (
              <div key={p.id} className="prescription-card">
                <div className="card-header">
                  <h5>{p.prescribing_doctor}</h5>
                  <span className="specialty-badge">{p.specialty}</span>
                </div>

                <div className="card-body">
                  <p><strong>Institución:</strong> {p.institution}</p>
                  <p><strong>Fecha:</strong> {formatDate(p.issue_date)}</p>
                  <p><strong>Medicamentos:</strong></p>
                  <ul>
                    {p.medications.split('\n').map((med, i) => (
                      <li key={i}>{med.trim()}</li>
                    ))}
                  </ul>
                  {p.description && <p><strong>Notas:</strong> {p.description}</p>}
                  {p.file && (
                    <a href={p.file} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                      <i className="bi bi-file-earmark-medical"></i> Ver documento
                    </a>
                  )}
                </div>

                <div className="card-footer">
                <button 
  onClick={() => navigate(`/menu/${perfilId}/prescriptions/editar/${p.id}`)} 
  className="btn btn-sm btn-outline-secondary me-2"
>
  <i className="bi bi-pencil"></i> Editar
</button>

                  <button onClick={() => handleDelete(p.id)} className="btn btn-sm btn-outline-danger">
                    <i className="bi bi-trash"></i> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar eliminación</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas eliminar esta receta médica?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-danger" onClick={handleDeleteConfirm}>Sí, eliminar</button>
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
