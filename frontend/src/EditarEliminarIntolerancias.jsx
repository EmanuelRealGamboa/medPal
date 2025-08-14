import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function EditarEliminarIntolerancias() {
  const { perfilId, intoleranciaId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    tipo: '',
    sintomas: '',
    diagnostico: ''
  });

  useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchIntolerancia = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/antecedentesMedicos/Intolerancias/${intoleranciaId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setForm(response.data);
      } catch (error) {
        console.error('Error al obtener la intolerancia:', error);
      }
    };

    if (intoleranciaId) {
      fetchIntolerancia();
    }
  }, [intoleranciaId, navigate, token]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/antecedentesMedicos/Intolerancias/${intoleranciaId}/`,
        { ...form, perfil: perfilId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      navigate(`/menu/${perfilId}/antecedentes-medicos`);
    } catch (error) {
      console.error('Error al actualizar la intolerancia:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/antecedentesMedicos/Intolerancias/${intoleranciaId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      navigate(`/menu/${perfilId}/antecedentes-medicos`);
    } catch (error) {
      console.error('Error al eliminar la intolerancia:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Editar o Eliminar Intolerancia</h2>
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
          <label className="form-label">Síntomas</label>
          <textarea
            className="form-control"
            name="sintomas"
            value={form.sintomas}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Diagnóstico</label>
          <textarea
            className="form-control"
            name="diagnostico"
            value={form.diagnostico}
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
          <button className="btn btn-secondary" onClick={() => navigate(`/menu/${perfilId}/antecedentes-medicos`)}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
