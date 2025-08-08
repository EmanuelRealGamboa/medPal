import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function EditDeletePersonalesNoPatologicos() {
  const { perfilId, personalesNoPatologicosId } = useParams();
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

  // Carga datos según el ID o perfil
  useEffect(() => {
    if (!perfilId) {
      setError('Perfil no definido.');
      return;
    }

    const fetchData = async () => {
      try {
        setError('');
        const headers = { Authorization: `Bearer ${token}` };

        if (personalesNoPatologicosId) {
          // Obtener registro por ID
          const res = await axios.get(
            `http://127.0.0.1:8000/antecedentesMedicos/personalesNoPatologicos/${personalesNoPatologicosId}/`,
            { headers }
          );
          setForm(res.data);
        } else {
          // Obtener lista filtrada por perfil y tomar el primero
          const res = await axios.get(
            `http://127.0.0.1:8000/antecedentesMedicos/personalesNoPatologicos/?perfil=${perfilId}`,
            { headers }
          );
          if (res.data.length > 0) {
            setForm(res.data[0]);
          } else {
            setError('No hay datos para este perfil.');
          }
        }
      } catch (err) {
        console.error(err);
        setError('Error al cargar los datos.');
      }
    };

    fetchData();
  }, [perfilId, personalesNoPatologicosId, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!form.id) {
      setError('No hay un registro válido para actualizar.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await axios.put(
        `http://127.0.0.1:8000/antecedentesMedicos/personalesNoPatologicos/${personalesNoPatologicosId}/`,
        { ...form, perfil: perfilId },
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
    if (!form.id) {
      setError('No hay un registro válido para eliminar.');
      return;
    }

    if (!window.confirm('¿Estás seguro de eliminar este registro?')) return;

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await axios.delete(
        `http://127.0.0.1:8000/antecedentesMedicos/personalesNoPatologicos/${personalesNoPatologicosId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
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

  // Componente Navbar simple reutilizable
  const Navbar = () => (
    <nav className="navbar navbar-dark bg-primary d-flex justify-content-between px-4 py-2">
      <span className="navbar-brand mb-0 h1">
        <i className="bi bi-person-circle me-2"></i>MedPal
      </span>
      <button
        className="btn btn-outline-light"
        onClick={() => {
          localStorage.removeItem('token');
          navigate('/signin');
        }}
      >
        Logout
      </button>
    </nav>
  );

  return (
    <div className="main-layout">
      <Navbar />

      <main className="container my-4">
        <h3 className="mb-4 text-center">Editar / Eliminar Personales No Patológicos</h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {loading && <div className="alert alert-info">Procesando...</div>}

        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label htmlFor="tabaquismo" className="form-label">
              Tabaquismo
            </label>
            <textarea
              id="tabaquismo"
              name="tabaquismo"
              className="form-control"
              placeholder="Describe el tabaquismo"
              value={form.tabaquismo}
              onChange={handleChange}
              required
              rows={2}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="alcohol" className="form-label">
              Consumo de alcohol
            </label>
            <textarea
              id="alcohol"
              name="alcohol"
              className="form-control"
              placeholder="Describe el consumo de alcohol"
              value={form.alcohol}
              onChange={handleChange}
              required
              rows={2}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="actividadFisica" className="form-label">
              Actividad física
            </label>
            <textarea
              id="actividadFisica"
              name="actividadFisica"
              className="form-control"
              placeholder="Describe la actividad física"
              value={form.actividadFisica}
              onChange={handleChange}
              required
              rows={2}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="alimentacion" className="form-label">
              Alimentación
            </label>
            <textarea
              id="alimentacion"
              name="alimentacion"
              className="form-control"
              placeholder="Describe la alimentación"
              value={form.alimentacion}
              onChange={handleChange}
              required
              rows={2}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="saludMental" className="form-label">
              Salud mental
            </label>
            <textarea
              id="saludMental"
              name="saludMental"
              className="form-control"
              placeholder="Describe la salud mental"
              value={form.saludMental}
              onChange={handleChange}
              required
              rows={2}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="suenio" className="form-label">
              Sueño
            </label>
            <textarea
              id="suenio"
              name="suenio"
              className="form-control"
              placeholder="Describe el sueño"
              value={form.suenio}
              onChange={handleChange}
              required
              rows={2}
            />
          </div>

          <div className="d-flex justify-content-between">
            <button className="btn btn-success" type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Actualizar'}
            </button>

            <button
              className="btn btn-danger"
              type="button"
              onClick={handleDelete}
              disabled={loading}
            >
              Eliminar
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
      </main>
    </div>
  );
}
