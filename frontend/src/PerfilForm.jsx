import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './PerfilForm.css';

export default function PerfilForm({ perfilId }) {
  const [form, setForm] = useState({
    nombre: '',
    fecha_nacimiento: '',
    relacion: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isEdit = Boolean(perfilId);

  useEffect(() => {
    if (isEdit) {
      axios
        .get(`http://127.0.0.1:8000/accounts/perfiles/${perfilId}/`, {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` }
        })
        .then(res => {
          const { nombre, fecha_nacimiento, relacion } = res.data;
          setForm({ nombre, fecha_nacimiento, relacion });
        })
        .catch(() => setError('No se pudo cargar el perfil.'));
    }
  }, [perfilId]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.nombre || !form.relacion) {
      setError('Por favor, completa los campos obligatorios.');
      setMensaje('');
      return;
    }

    try {
      const url = isEdit
        ? `http://127.0.0.1:8000/accounts/perfiles/${perfilId}/`
        : `http://127.0.0.1:8000/accounts/perfiles/`;
      const method = isEdit ? 'put' : 'post';

      await axios[method](url, form, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` }
      });

      setMensaje(isEdit ? 'Perfil actualizado correctamente.' : 'Perfil creado con éxito.');
      setError('');

      setTimeout(() => navigate('/perfiles'), 1200);
    } catch (err) {
      setError('Hubo un error al guardar el perfil. Intenta nuevamente.');
      setMensaje('');
    }
  };

  const handleEliminar = async () => {
    const resultado = await Swal.fire({
      title: '¿Eliminar perfil?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!resultado.isConfirmed) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/accounts/perfiles/${perfilId}/`, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` }
      });

      Swal.fire({
        title: 'Eliminado',
        text: 'El perfil fue eliminado correctamente.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

      setTimeout(() => navigate('/perfiles'), 1600);
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar el perfil.',
        icon: 'error'
      });
    }
  };

  const handleCerrar = () => {
    navigate('/perfiles');
  };

  return (
    <div className="perfil-page container-fluid">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-8 position-relative">
          <div className="perfil-form">
            <div className="d-flex justify-content-end mb-2">
              <button
                type="button"
                className="btn-close btn-close-dark"
                aria-label="Cerrar"
                onClick={handleCerrar}
              ></button>
            </div>

            <h2 className="text-center mb-4">{isEdit ? 'Editar Perfil' : 'Agregar Perfil'}</h2>

            {mensaje && <div className="alert alert-success text-center">{mensaje}</div>}
            {error && <div className="alert alert-danger text-center">{error}</div>}

            <form onSubmit={handleSubmit} className="row g-4">
              <div className="col-12">
                <label className="form-label">
                  Nombre <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Fecha de nacimiento</label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  className="form-control"
                  value={form.fecha_nacimiento}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Relación <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="relacion"
                  className="form-control"
                  value={form.relacion}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 d-flex justify-content-center gap-3">
                {isEdit && (
                  <button
                    type="button"
                    className="btn btn-eliminar"
                    onClick={handleEliminar}
                  >
                    Eliminar
                  </button>

                )}
                <button type="submit" className="btn btn-primary px-4">
                  {isEdit ? 'Actualizar' : 'Agregar Perfil'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary px-4"
                  onClick={handleCerrar}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
