import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PersonalInfoForm.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PersonalInfoForm() {
  const navigate = useNavigate();
  const { perfilId } = useParams();
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    nombre: '',
    fechaNacimiento: '',
    genero: '',
    grupoRH: '',
    contactoEmergencia: '',
    nombreContactoEmergencia: '',
    photoUser: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carga datos usuario + personal-data para prellenar formulario
  useEffect(() => {
    async function fetchData() {
      if (!token || !perfilId) {
        toast.error('Falta token o perfilId');
        setLoading(false);
        return;
      }

      try {
        // Obtener usuarios
        const userRes = await axios.get('http://127.0.0.1:8000/accounts/users/', {
          headers: { Authorization: `Token ${token}` },
        });

        // Obtener datos personales
        const personalRes = await axios.get('http://127.0.0.1:8000/accounts/personal-data/', {
          headers: { Authorization: `Token ${token}` },
        });

        // Extraer email del token para identificar usuario actual
        let email = null;
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          email = payload.email;
        } catch {
          email = null;
        }

        const currentUser = userRes.data.find(u => u.email === email);
        if (!currentUser) throw new Error('Usuario no encontrado');

        const personalData = personalRes.data.find(pd => String(pd.perfil) === String(perfilId)) || {};

        setFormData({
          nombre: `${currentUser.name || ''} ${currentUser.apellido_paterno || ''} ${currentUser.apellido_materno || ''}`.trim(),
          fechaNacimiento: personalData.fecha_nacimiento || '',
          genero: personalData.genero || '',
          grupoRH: currentUser.grupoRH || '',
          contactoEmergencia: currentUser.contactoEmergencia || '',
          photoUser: null,
        });

        if (currentUser.photoUser) setPhotoPreview(currentUser.photoUser);

      } catch (error) {
        console.error('Error cargando datos:', error);
        toast.error('Error al cargar los datos para editar');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [perfilId, token]);

  const handleInputChange = e => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));


    if (name === 'nombreContactoEmergencia') {
      const nombreRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]*$/;
      if (!nombreRegex.test(value)) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, photoUser: file }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const nombreRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nombreRegex.test(formData.nombreContactoEmergencia)) {
      toast.error('El nombre del contacto de emergencia solo puede contener letras y espacios.');
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append('nombre', formData.nombre);
    dataToSend.append('fecha_nacimiento', formData.fechaNacimiento);
    dataToSend.append('genero', formData.genero);
    dataToSend.append('grupoRH', formData.grupoRH);
    dataToSend.append('contactoEmergencia', formData.contactoEmergencia);
    dataToSend.append('nombre_contacto_emergencia', formData.nombreContactoEmergencia);

    if (formData.photoUser) {
      dataToSend.append('photoUser', formData.photoUser);
    }

    try {
      // Primero consulta si ya existe personalData para perfilId (para PUT o POST)
      const existingRes = await axios.get(`http://127.0.0.1:8000/accounts/personal-data/?perfil=${perfilId}`, {
        headers: { Authorization: `Token ${token}` },
      });

      if (existingRes.data.length > 0) {
        // Actualizar (PUT) el primer registro que encontró
        const id = existingRes.data[0].id;
        await axios.put(`http://127.0.0.1:8000/accounts/personal-data/?perfil=${perfilId}`, dataToSend, {
          headers: { Authorization: `Token ${token}`, 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Datos actualizados correctamente');
      } else {
        // Crear nuevo (POST)
        await axios.post('http://127.0.0.1:8000/accounts/personal-data/', dataToSend, {
          headers: { Authorization: `Token ${token}`, 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Datos guardados correctamente');
      }

      setTimeout(() => {
        navigate(`/menu/${perfilId}/datos-personales`);
      }, 1500);
    } catch (error) {
      console.error('Error guardando datos:', error);
      toast.error('Error al guardar los datos');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) {
    return <div className="text-center py-5">Cargando datos...</div>;
  }

  return (
    <div className="main-layout">

      {/* Navbar */}

      <nav className="custom-navbar d-flex justify-content-between align-items-center px-4 py-2">
        <h4 className="text-light m-0">
          <i className="bi bi-person-circle me-2"></i>MedPal
        </h4>
        <button onClick={handleLogout} className="btn btn-outline-light">Logout</button>
      </nav>


    {/* Formulario */}


      <main className="form-section d-flex justify-content-center align-items-center py-4">
        <div className="form-card p-4 rounded shadow-sm custom-width">
          <h3 className="text-center mb-4">Editar Datos Personales</h3>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row mb-3">

              {/* Foto */}

              <div className="col-md-4 mb-3">
                <label className="form-label">Foto de Perfil</label>
                <div className="photo-placeholder border rounded bg-light d-flex justify-content-center align-items-center flex-column">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
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
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="col-md-8">
                <div className="mb-3">
                  <label className="form-label">Nombre Completo</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="form-control bg-light"
                  />
                </div>

                <div className="row gx-5">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Fecha de nacimiento</label>
                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={formData.fechaNacimiento}
                      onChange={handleInputChange}
                      className="form-control bg-light"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Género</label>
                    <select
                      name="genero"
                      value={formData.genero}
                      onChange={handleInputChange}
                      className="form-select bg-light"
                    >
                      <option value="">Selecciona</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Grupo RH</label>
                <select
                  name="grupoRH"
                  value={formData.grupoRH}
                  onChange={handleInputChange}
                  className="form-select bg-light"
                >
                  <option value="">Selecciona</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>

                <div className="mt-3">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="text"
                    name="contactoEmergencia"
                    value={formData.contactoEmergencia}
                    onChange={handleInputChange}
                    className="form-control bg-light"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Contacto de Emergencia</label>
                <input
                  type="text"
                  name="nombreContactoEmergencia"
                  value={formData.nombreContactoEmergencia}
                  onChange={handleInputChange}
                  className="form-control bg-light"
                />
              </div>
            </div>


            <div className="d-flex justify-content-end gap-3 mt-4">
              <button type="button" className="btn btn-secondary" onClick={() => navigate(`/menu/${perfilId}`)}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
      </main>

      <footer className="custom-footer text-center text-light py-2">
        © 2025 MedPal
      </footer>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}