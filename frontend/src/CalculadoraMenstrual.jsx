import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./CalculadoraMenstrual.css";

export default function CalculadoraMenstrual() {
  const { perfilId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const registroId = new URLSearchParams(location.search).get("registroId");

  const [formData, setFormData] = useState({
    fecha_ultima_menstruacion: "",
    duracion_promedio_ciclo: "",
    duracion_promedio_sangrado: "",
    es_regular: "",
    sintomas: "",
    observaciones: "",
    medicacion_hormonal: "",
  });

  // Si viene registroId, cargar datos del backend
  useEffect(() => {
    if (registroId) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://127.0.0.1:8000/gineco/menstrual/${registroId}/`,
            { headers: { Authorization: `Token ${token}` } }
          );
          const data = response.data;
          setFormData({
            fecha_ultima_menstruacion: data.fecha_ultima_menstruacion || "",
            duracion_promedio_ciclo: data.duracion_promedio_ciclo || "",
            duracion_promedio_sangrado: data.duracion_promedio_sangrado || "",
            es_regular: data.es_regular !== null ? data.es_regular : "",
            sintomas: data.sintomas || "",
            observaciones: data.observaciones || "",
            medicacion_hormonal: data.medicacion_hormonal || "",
          });
        } catch (error) {
          console.error(error);
          alert("Error al cargar registro menstrual");
        }
      };
      fetchData();
    }
  }, [registroId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    if (!perfilId) return alert("ID de perfil no válido");
    try {
      const token = localStorage.getItem("token");
      if (registroId) {
        // PUT
        await axios.put(
          `http://127.0.0.1:8000/gineco/menstrual/${registroId}/`,
          { ...formData, user: perfilId },
          { headers: { Authorization: `Token ${token}` } }
        );
        alert("Registro menstrual actualizado");
      } else {
        // POST
        await axios.post(
          `http://127.0.0.1:8000/gineco/menstrual/`,
          { ...formData, user: perfilId },
          { headers: { Authorization: `Token ${token}` } }
        );
        alert("Registro menstrual guardado");
      }
      navigate(`/menu/${perfilId}/gineco/prediccion-ciclo`);
    } catch (error) {
      console.error(error);
      alert("Error al guardar el registro menstrual");
    }
  };

  return (
    <div className="calculadora-container">
      <nav className="navbar">
        <div className="navbar-logo">
          <span className="logo-med">Med</span>
          <span className="logo-pal">Pal</span>
        </div>
        <div className="navbar-user-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            className="user-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a8.25 8.25 0 1 1 15 0v.75H4.5v-.75Z"
            />
          </svg>
        </div>
      </nav>

      <main className="main-panel">
        <div className="panel-card">
          <h1 className="panel-title">Calculadora menstrual</h1>
          <p style={{ fontSize: "0.9rem", color: "#555" }}>Perfil activo: {perfilId}</p>

          <form className="form-grid">
            <div className="form-group">
              <label htmlFor="fecha_ultima_menstruacion">Fecha del último período</label>
              <input
                type="date"
                id="fecha_ultima_menstruacion"
                name="fecha_ultima_menstruacion"
                value={formData.fecha_ultima_menstruacion}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="duracion_promedio_ciclo">Duración promedio del ciclo (días)</label>
              <input
                type="number"
                id="duracion_promedio_ciclo"
                name="duracion_promedio_ciclo"
                value={formData.duracion_promedio_ciclo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="duracion_promedio_sangrado">Duración promedio del sangrado (días)</label>
              <input
                type="number"
                id="duracion_promedio_sangrado"
                name="duracion_promedio_sangrado"
                value={formData.duracion_promedio_sangrado}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="es_regular">Regularidad</label>
              <select
                id="es_regular"
                name="es_regular"
                value={formData.es_regular}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione</option>
                <option value={true}>Regular</option>
                <option value={false}>Irregular</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="sintomas">Síntomas</label>
              <input
                id="sintomas"
                name="sintomas"
                value={formData.sintomas}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="medicacion_hormonal">Medicación hormonal</label>
              <input
                id="medicacion_hormonal"
                name="medicacion_hormonal"
                value={formData.medicacion_hormonal}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="observaciones">Observaciones</label>
              <textarea
                id="observaciones"
                name="observaciones"
                rows="3"
                value={formData.observaciones}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="form-button">
              <button type="button" onClick={handleSubmit}>
                {registroId ? "Actualizar registro" : "Guardar registro"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
