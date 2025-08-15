import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function EditDeleteHeredoFamiliares() {
  const { perfilId, id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    nombreEnfermedad: '',
    parentesco: '',
    tipoEnfermedad: '',
    edadDiacnosticoEnfermedad: '',
    estadoActual: ''
  });

  useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/antecedentesMedicos/heredoFamiliares/${id}/?perfil=${perfilId}`,
          {
            headers: { Authorization: `Token ${token}` }
          }
        );
        setForm(response.data);
      } catch (error) {
        console.error('Error al obtener el antecedente heredo familiar:', error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, navigate, perfilId, token]);

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/antecedentesMedicos/heredoFamiliares/${id}/?perfil=${perfilId}`,
        form,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      navigate(`/menu/${perfilId}/antecedentes-medicos`);
    } catch (error) {
      console.error('Error al actualizar:', error.response?.data || error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/antecedentesMedicos/heredoFamiliares/${id}/?perfil=${perfilId}`,
        {
          headers: { Authorization: `Token ${token}` }
        }
      );
      navigate(`/menu/${perfilId}/antecedentes-medicos`);
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Editar o Eliminar Heredo Familiar</h2>
      <div className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Nombre de la enfermedad</label>
          <input
            type="text"
            className="form-control"
            name="nombreEnfermedad"
            value={form.nombreEnfermedad}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Parentesco</label>
          <input
            type="text"
            className="form-control"
            name="parentesco"
            value={form.parentesco}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tipo de enfermedad</label>
          <textarea
            className="form-control"
            name="tipoEnfermedad"
            value={form.tipoEnfermedad}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Edad diagnóstico</label>
          <input
            type="number"
            className="form-control"
            name="edadDiacnosticoEnfermedad"
            value={form.edadDiacnosticoEnfermedad}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Estado actual</label>
          <input
            type="text"
            className="form-control"
            name="estadoActual"
            value={form.estadoActual}
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
