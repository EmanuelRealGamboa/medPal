import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ChronicConditionForm() {
  const { id, perfilId } = useParams();
  const navigate = useNavigate();
  const API_URL = "http://127.0.0.1:8000/chronic-conditions/";

  const [form, setForm] = useState({
    disease_name: "",
    diagnosis_date: "",
    age_at_diagnosis: "",
    diagnosing_institution: "",
    diagnosing_physician: "",
    current_status: "CONTROLLED",
    classification_system: "",
    classification_level: "",
    is_active: true,
  });

  // Cargar datos si es edición
  useEffect(() => {
    if (id) {
      axios
        .get(`${API_URL}${id}/`)
        .then((res) => setForm(res.data))
        .catch((err) => console.error("Error cargando condición:", err));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`${API_URL}${id}/`, { ...form, perfil: perfilId });
      } else {
        await axios.post(API_URL, { ...form, perfil: perfilId });
      }
      navigate(`/menu/${perfilId}/Enfermedades_Cronicas`);
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? "Editar Condición Crónica" : "Nueva Condición Crónica"}</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Enfermedad</label>
          <input
            type="text"
            className="form-control"
            name="disease_name"
            value={form.disease_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Fecha diagnóstico</label>
            <input
              type="date"
              className="form-control"
              name="diagnosis_date"
              value={form.diagnosis_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Edad al diagnóstico</label>
            <input
              type="number"
              className="form-control"
              name="age_at_diagnosis"
              value={form.age_at_diagnosis}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Institución</label>
          <input
            type="text"
            className="form-control"
            name="diagnosing_institution"
            value={form.diagnosing_institution}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Médico</label>
          <input
            type="text"
            className="form-control"
            name="diagnosing_physician"
            value={form.diagnosing_physician}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Estado actual</label>
          <select
            className="form-select"
            name="current_status"
            value={form.current_status}
            onChange={handleChange}
          >
            <option value="CONTROLLED">Controlado</option>
            <option value="POORLY_CONTROLLED">Mal controlado</option>
            <option value="REMISSION">En remisión</option>
            <option value="PROGRESSIVE">Progresivo</option>
          </select>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Sistema de clasificación</label>
            <input
              type="text"
              className="form-control"
              name="classification_system"
              value={form.classification_system}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Nivel de clasificación</label>
            <input
              type="text"
              className="form-control"
              name="classification_level"
              value={form.classification_level}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
          />
          <label className="form-check-label">Activo</label>
        </div>

        <button type="submit" className="btn btn-success me-2">
          {id ? "Actualizar" : "Guardar"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}
