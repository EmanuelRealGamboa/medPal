import React, { useState, useEffect } from "react";import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./CalculadoraMenstrual.css";

export default function CalculadoraMenstrual() {
  const { perfilId } = useParams();
  const location = useLocation();
  const registroId = new URLSearchParams(location.search).get("registroId");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState("Paciente");
  const [formData, setFormData] = useState({
    perfil: 5,
    fecha_ultima_menstruacion: "",
    duracion_promedio_ciclo: "",
    duracion_promedio_sangrado: "",
    es_regular: "",
    sintomas: "",
    observaciones: "",
    medicacion_hormonal: "",
  });
  const [errors, setErrors] = useState({});

  // Cargar datos de perfil y del registro (si existe)
  useEffect(() => {
    async function fetchData() {
      try {
        // Traer datos del perfil (ej: nombre del paciente)
        const perfilRes = await axios.get(
          `http://127.0.0.1:8000/accounts/perfiles/${perfilId}/`,
          { headers: { Authorization: `Token ${token}` } }
        );
        setPatientName(perfilRes.data.nombre || "Paciente");

        // Si es edición, traer registro existente
        if (registroId) {
          const regRes = await axios.get(
            `http://127.0.0.1:8000/gineco/menstrual/${registroId}/`,
            { headers: { Authorization: `Token ${token}` } }
          );
          setFormData({
            perfil: perfilId,
            fecha_ultima_menstruacion: regRes.data.fecha_ultima_menstruacion || "",
            duracion_promedio_ciclo: regRes.data.duracion_promedio_ciclo || "",
            duracion_promedio_sangrado: regRes.data.duracion_promedio_sangrado || "",
            es_regular: regRes.data.es_regular !== null ? regRes.data.es_regular : "",
            sintomas: regRes.data.sintomas || "",
            observaciones: regRes.data.observaciones || "",
            medicacion_hormonal: regRes.data.medicacion_hormonal || "",
          });
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    }

    if (perfilId) fetchData();
  }, [perfilId, registroId, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const payload = {
        ...formData,
        es_regular: formData.es_regular === "true" || formData.es_regular === true,
      };

      if (registroId) {
        // Modo edición
        await axios.put(
          `http://127.0.0.1:8000/gineco/menstrual/${registroId}/`,
          payload,
          { headers: { Authorization: `Token ${token}` } }
        );
        alert("Registro menstrual actualizado correctamente");
      } else {
        // Modo creación
        await axios.post(`http://127.0.0.1:8000/gineco/menstrual/`, payload, {
          headers: { Authorization: `Token ${token}` },
        });
        alert("Registro menstrual guardado correctamente");
      }

      navigate(`/menu/${perfilId}/gineco/prediccion-ciclo`);
    } catch (error) {
      console.error("Error guardando:", error.response?.data || error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ form: "Error inesperado al guardar" });
      }
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando información...</p>;
  }

  return (
    <div className="calculadora-container">
      <nav className="navbar">
        <div className="navbar-logo">
          <span className="logo-med">Med</span>
          <span className="logo-pal">Pal</span>
        </div>
      </nav>

      <main className="main-panel">
        <div className="panel-card">
          <h1 className="panel-title">Calculadora menstrual</h1>
          <p style={{ fontSize: "0.9rem", color: "#555" }}>
            Perfil activo: {patientName} (ID {perfilId})
          </p>

          {errors.form && <p className="form-error">{errors.form}</p>}

          <form className="form-grid" onSubmit={handleSubmit}>
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
              <button type="submit">
                {registroId ? "Actualizar registro" : "Guardar registro"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
