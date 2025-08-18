import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function EditPersonalInfo() {
  const [formData, setFormData] = useState({
    grupoRH: '',
    contactoEmergencia: '',
    photoUser: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/accounts/me/', {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => {
      const data = res.data;
      setFormData({
        grupoRH: data.grupoRH || '',
        contactoEmergencia: data.contactoEmergencia || '',
        photoUser: null,
      });
      if (data.photoUser) {
        setPhotoPreview(data.photoUser);
      }
    })
    .catch(err => console.error('Error al cargar datos:', err));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, photoUser: file }));

    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    if (formData.photoUser) data.append('photoUser', formData.photoUser);
    data.append('grupoRH', formData.grupoRH);
    data.append('contactoEmergencia', formData.contactoEmergencia);

    try {
      await axios.put('http://127.0.0.1:8000/accounts/me/', data, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMensaje('Datos actualizados correctamente.');
    } catch (err) {
      console.error('Error al actualizar:', err);
      setMensaje('Hubo un error al actualizar los datos.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Seguro que deseas eliminar tu perfil? Esta acción no se puede deshacer.')) return;
    try {
      await axios.delete('http://127.0.0.1:8000/accounts/me/', {
        headers: { Authorization: `Token ${token}` }
      });
      setMensaje('Perfil eliminado. Cierra sesión.');
      // Puedes redirigir a logout o pantalla principal si deseas.
    } catch (err) {
      console.error('Error al eliminar:', err);
      setMensaje('Hubo un error al eliminar el perfil.');
    }
  };

  return (
    <div className="container mt-5">
      <h3>Editar Datos Personales</h3>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Foto de Perfil</label>
          <input type="file" accept="image/*" className="form-control" onChange={handleFileChange} />
          {photoPreview && <img src={photoPreview} alt="Preview" className="img-thumbnail mt-2" style={{ height: '100px' }} />}
        </div>

        <div className="mb-3">
          <label>Grupo RH</label>
          <select name="grupoRH" className="form-select" value={formData.grupoRH} onChange={handleChange}>
            <option value="">Selecciona</option>
            <option>O+</option><option>O-</option>
            <option>A+</option><option>A-</option>
            <option>B+</option><option>B-</option>
            <option>AB+</option><option>AB-</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Contacto de Emergencia</label>
          <input
            type="text"
            name="contactoEmergencia"
            className="form-control"
            value={formData.contactoEmergencia}
            onChange={handleChange}
          />
        </div>

        {mensaje && <div className="alert alert-info">{mensaje}</div>}

        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">Actualizar</button>
          <button type="button" onClick={handleDelete} className="btn btn-danger">Eliminar Perfil</button>
        </div>
      </form>
    </div>
  );
}
