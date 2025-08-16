import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function EditDeletePersonalesNoPatologicos() {
  const { perfilId, id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    tabaquismo: '',
    alcohol: '',
    actividadFisica: '',
    alimentacion: '',
    saludMental: '',
    suenio: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchData = async () => {
      try {
        setError('');
        const res = await axios.get(
          `http://127.0.0.1:8000/antecedentesMedicos/personalesNoPatologicos/${id}/?perfil=${perfilId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setForm(res.data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar los datos.');
      }
    };

    if (id) fetchData();
  }, [id, perfilId, navigate, token]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await axios.put(
        `http://127.0.0.1:8000/antecedentesMedicos/personalesNoPatologicos/${id}/?perfil=${perfilId}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setSuccessMsg('Datos actualizados correctamente.');
      setTimeout(() => navigate(`/menu/${perfilId}/antecedentes-medicos`), 1500);
    } catch (err) {
      console.error(err);
      setError('Error al actualizar los datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este registro?')) return;

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await axios.delete(
        `http://127.0.0.1:8000/antecedentesMedicos/personalesNoPatologicos/${id}/?perfil=${perfilId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMsg('Registro eliminado correctamente.');
      setTimeout(() => navigate(`/menu/${perfilId}/antecedentes-medicos`), 1500);
    } catch (err) {
      console.error(err);
      setError('Error al eliminar el registro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Editar / Eliminar Personales No Patológicos</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {loading && <div className="alert alert-info">Procesando...</div>}

      <form onSubmit={handleUpdate}>
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="tabaquismo" className="form-label">Tabaquismo</label>
            <textarea
              id="tabaquismo"
              name="tabaquismo"
              className="form-control"
              rows={2}
              value={form.tabaquismo}
              onChange={handleChange}
              required
              placeholder="Describe el tabaquismo"
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="alcohol" className="form-label">Consumo de alcohol</label>
            <textarea
              id="alcohol"
              name="alcohol"
              className="form-control"
              rows={2}
              value={form.alcohol}
              onChange={handleChange}
              required
              placeholder="Describe el consumo de alcohol"
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="actividadFisica" className="form-label">Actividad física</label>
            <textarea
              id="actividadFisica"
              name="actividadFisica"
              className="form-control"
              rows={2}
              value={form.actividadFisica}
              onChange={handleChange}
              required
              placeholder="Describe la actividad física"
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="alimentacion" className="form-label">Alimentación</label>
            <textarea
              id="alimentacion"
              name="alimentacion"
              className="form-control"
              rows={2}
              value={form.alimentacion}
              onChange={handleChange}
              required
              placeholder="Describe la alimentación"
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="saludMental" className="form-label">Salud mental</label>
            <textarea
              id="saludMental"
              name="saludMental"
              className="form-control"
              rows={2}
              value={form.saludMental}
              onChange={handleChange}
              required
              placeholder="Describe la salud mental"
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="suenio" className="form-label">Sueño</label>
            <textarea
              id="suenio"
              name="suenio"
              className="form-control"
              rows={2}
              value={form.suenio}
              onChange={handleChange}
              required
              placeholder="Describe el sueño"
            />
          </div>
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button className="btn btn-success" type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>

          <button className="btn btn-danger" type="button" onClick={handleDelete} disabled={loading}>
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>

          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => navigate(`/menu/${perfilId}/antecedentes-medicos`)}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
