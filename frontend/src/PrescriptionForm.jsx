import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import './PrescriptionForm.css';

export default function PrescriptionForm() {
  const { id, perfilId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // Estado separado para el nombre del paciente (no se sobrescribe)
  const [patientName, setPatientName] = useState('');

  const [formData, setFormData] = useState({
    issue_date: "",
    institution: "",
    prescribing_doctor: "",
    specialty: "",
    description: "",
    medications: "",
    file: null,
  });

  const [currentFile, setCurrentFile] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Cargar usuario desde localStorage
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      console.log("Usuario cargado desde localStorage:", storedUser);
      if (storedUser && storedUser.username) {
        setPatientName(storedUser.username);
      }
    } catch (err) {
      console.error("Error leyendo el usuario de localStorage:", err);
    }
  }, []);
  
  

  // Cargar receta si es edición
  useEffect(() => {
    if (isEdit) {
      const fetchPrescription = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/prescriptions/prescriptions/${id}/`,
            { headers: { Authorization: `Token ${localStorage.getItem('token')}` } }
          );
          setFormData({
            issue_date: response.data.issue_date || '',
            institution: response.data.institution || '',
            prescribing_doctor: response.data.prescribing_doctor || '',
            specialty: response.data.specialty || '',
            description: response.data.description || '',
            medications: response.data.medications || '',
            file: null,
          });
          setCurrentFile(response.data.file);
        } catch (err) {
          console.error(err);
          setError(`No se pudo cargar la receta médica: ${err.response?.data?.detail || ''}`);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPrescription();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setValidationErrors(prev => ({ ...prev, [name]: !value }));
  };

  const validateForm = () => {
    const errors = {
      issue_date: !formData.issue_date,
      institution: !formData.institution,
      prescribing_doctor: !formData.prescribing_doctor,
      specialty: !formData.specialty,
      medications: !formData.medications,
      file: !isEdit && !formData.file,
    };
    setValidationErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const prepareFormData = () => {
    const data = new FormData();
    data.append('patient_name', patientName); // siempre enviar el nombre del paciente
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        if (key === 'file' && value instanceof File) {
          data.append(key, value);
        } else if (key !== 'file') {
          data.append(key, value);
        }
      }
    });
    if (isEdit && currentFile && !formData.file) {
      data.append('keep_existing_file', 'true');
    }
    return data;
  };

  const submitForm = async () => {
    if (!validateForm()) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    const data = prepareFormData();
    try {
      setIsLoading(true);
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
      }
    } catch (err) {
      console.error(err);
      setError('Error al guardar la receta médica. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      setShowConfirmModal(true);
    } else {
      await submitForm();
    }
  };

  // Cargando receta
  if (isLoading && isEdit && !showConfirmModal) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando receta médica...</p>
      </div>
    );
  }

  return (
    <div className="prescription-form-container">
      {/* Navbar */}
      <nav className="custom-navbar d-flex justify-content-between align-items-center px-4 py-2">
        <h4 className="text-light m-0">MedPal</h4>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }} className="btn btn-outline-light">Logout</button>
      </nav>

      {/* Formulario */}
      <form className="prescription-form" onSubmit={handleSubmit}>
        <h1>{isEdit ? 'Editar Receta Médica' : 'Nueva Receta Médica'}</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="form-group">
          <label>Nombre del paciente</label>
          <input type="text" value={patientName || ""} disabled className="form-control" />
        </div>

        <div className="form-group">
          <label>Fecha de emisión</label>
          <input type="date" name="issue_date" value={formData.issue_date} onChange={handleChange} onBlur={handleBlur} />
        </div>

        <div className="form-group">
          <label>Institución</label>
          <input type="text" name="institution" value={formData.institution} onChange={handleChange} onBlur={handleBlur} />
        </div>

        <div className="form-group">
          <label>Médico que prescribe</label>
          <input type="text" name="prescribing_doctor" value={formData.prescribing_doctor} onChange={handleChange} onBlur={handleBlur} />
        </div>

        <div className="form-group">
          <label>Especialidad</label>
          <input type="text" name="specialty" value={formData.specialty} onChange={handleChange} onBlur={handleBlur} />
        </div>

        <div className="form-group">
          <label>Medicamentos</label>
          <textarea name="medications" value={formData.medications} onChange={handleChange} onBlur={handleBlur} rows="4" />
        </div>

        <div className="form-group">
          <label>Notas / Descripción</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
        </div>

        <div className="form-group">
          <label>Archivo PDF (opcional)</label>
          <input type="file" name="file" onChange={handleChange} accept=".pdf" />
          {isEdit && currentFile && !formData.file && <p>Archivo actual: {currentFile}</p>}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(`/menu/${perfilId}/prescriptions`)}>Volver</button>
          <button type="submit" className="btn btn-secondary">{isEdit ? 'Actualizar Receta' : 'Guardar Receta'}</button>
        </div>
      </form>

      {/* Modales de confirmación y éxito */}
      {showConfirmModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar actualización</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirmModal(false)} disabled={isLoading}></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas actualizar esta receta médica?</p>
              </div>
              <div className="modal-footer">
                <button className="btn-consistent" onClick={() => setShowConfirmModal(false)} disabled={isLoading}>Cancelar</button>
                <button className="btn-consistent" onClick={submitForm} disabled={isLoading}>
                  {isLoading ? 'Actualizando...' : 'Sí, actualizar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
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
                    navigate(`/menu/${perfilId}/prescriptions`);
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
                    navigate(`/menu/${perfilId}/prescriptions`);
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
