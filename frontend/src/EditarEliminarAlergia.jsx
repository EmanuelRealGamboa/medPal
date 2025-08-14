import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditDeleteAlergia() {
  const { perfilId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tipo: '',
    reaccion: '',
    fechaPrimerEvento: '',
    frecuencia: '',
  });
  const [alergiaId, setAlergiaId] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [sinDatos, setSinDatos] = useState(false);

  useEffect(() => {
    if (!perfilId) return;

    const fetchAlergia = async () => {
      setCargando(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `http://127.0.0.1:8000/antecedentesMedicos/Alergias/?perfil=${perfilId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.length === 0) {
          setSinDatos(true);
        } else {
          const alergia = res.data[0];
          setAlergiaId(alergia.id);
          setForm({
            tipo: alergia.tipo || '',
            reaccion: alergia.reaccion || '',
            fechaPrimerEvento: alergia.fechaPrimerEvento || '',
            frecuencia: alergia.frecuencia || '',
          });
        }
      } catch (err) {
        setError('Error cargando la alergia');
      } finally {
        setCargando(false);
      }
    };

    fetchAlergia();
  }, [perfilId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!alergiaId) {
      alert('No se puede actualizar, ID no encontrado.');
      return;
    }

    setCargando(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://127.0.0.1:8000/antecedentesMedicos/Alergias/${alergiaId}/`,
        { ...form, perfil: perfilId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Actualizado correctamente');
      navigate(`/menu/${perfilId}/antecedentes-medicos`);
    } catch (err) {
      setError('Error al actualizar. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  const handleDelete = async () => {
    if (!alergiaId) {
      setError('ID no válido');
      return;
    }

    if (!window.confirm('¿Estás seguro de eliminar esta alergia?')) return;

    setCargando(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://127.0.0.1:8000/antecedentesMedicos/Alergias/${alergiaId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Alergia eliminada');
      navigate(`/menu/${perfilId}/antecedentes-medicos`);
    } catch (err) {
      setError('Error al eliminar. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  if (sinDatos) {
    return <p className="text-warning text-center mt-4">No hay alergias registradas para este perfil.</p>;
  }

  return (
    <div className="main-layout">
      <nav className="custom-navbar d-flex justify-content-between align-items-center px-4 py-2">
        <h4 className="text-light m-0">
          <i className="bi bi-person-circle me-2"></i>MedPal
        </h4>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/signin');
          }}
          className="btn btn-outline-light"
        >
          Logout
        </button>
      </nav>

      <main className="form-section d-flex justify-content-center align-items-center py-4">
        <div className="form-card p-4 rounded shadow-sm custom-width">
          <h3>Editar / Eliminar Alergia</h3>

          {error && <div className="alert alert-danger">{error}</div>}
          {cargando && <div className="alert alert-info">Procesando...</div>}

          <form onSubmit={handleSubmit}>
            <textarea
              className="form-control mb-2"
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              placeholder="Tipo"
              required
            />
            <textarea
              className="form-control mb-2"
              name="reaccion"
              value={form.reaccion}
              onChange={handleChange}
              placeholder="Reacción"
              required
            />
            <input
              className="form-control mb-2"
              type="date"
              name="fechaPrimerEvento"
              value={form.fechaPrimerEvento}
              onChange={handleChange}
              required
            />
            <input
              className="form-control mb-2"
              name="frecuencia"
              value={form.frecuencia}
              onChange={handleChange}
              placeholder="Frecuencia"
              required
            />
            <div className="d-flex justify-content-between">
              <button className="btn btn-primary" disabled={cargando}>
                {cargando ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={cargando}
              >
                {cargando ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
