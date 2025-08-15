import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FormAlergias.css';

export default function EditarEliminarAlergia() {
  const { perfilId, id } = useParams(); // Aquí el nombre debe coincidir con la ruta
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    tipo: '',
    reaccion: '',
    fechaPrimerEvento: '',
    frecuencia: '',
  });

  useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchAlergia = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/antecedentesMedicos/Alergias/${id}/?perfil=${perfilId}`,
          {
            headers: { Authorization: `Token ${token}` }
          }
        );
        setForm(response.data);
      } catch (error) {
        console.error('Error al obtener la alergia:', error);
      }
    };

    if (id) { // ✅ antes estaba alergiaId
      fetchAlergia();
    }
  }, [id, navigate, perfilId, token]); // ✅ dependencias corregidas

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/antecedentesMedicos/Alergias/${id}/?perfil=${perfilId}`,
        form,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      navigate(`/menu/${perfilId}/antecedentes-medicos`);
    } catch (error) {
      console.error('Error al actualizar la alergia:', error.response?.data || error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/antecedentesMedicos/Alergias/${id}/?perfil=${perfilId}`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      navigate(`/menu/${perfilId}/antecedentes-medicos`);
    } catch (error) {
      console.error('Error al eliminar la alergia:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Editar o Eliminar Alergia</h2>
      <div className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Tipo</label>
          <input
            type="text"
            className="form-control"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Reacción</label>
          <textarea
            className="form-control"
            name="reaccion"
            value={form.reaccion}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Fecha del primer evento</label>
          <input
            type="date"
            className="form-control"
            name="fechaPrimerEvento"
            value={form.fechaPrimerEvento}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Frecuencia</label>
          <input
            type="text"
            className="form-control"
            name="frecuencia"
            value={form.frecuencia}
            onChange={handleChange}
          />
        </div>

        <div className="d-flex justify-content-between">
          <button className="btn btn-success" onClick={handleUpdate}>
            Guardar Cambios
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Eliminar
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/menu/${perfilId}/antecedentes-medicos`)}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
