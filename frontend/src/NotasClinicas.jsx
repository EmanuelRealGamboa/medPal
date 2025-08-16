import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./NotasClinicas.css";

export default function NotasClinicasForm() {
  const { perfilId, notaId } = useParams(); // notaId opcional
  const navigate = useNavigate();
  const API_URL = "http://127.0.0.1:8000/api/notas-clinicas/";

  const [formData, setFormData] = useState({
    tipo_nota: "",
    recomendaciones: "",
    proxima_cita: "",
    observaciones: "",
  });

  // Si hay notaId, cargar datos del backend
  useEffect(() => {
    if (notaId) {
      const fetchNota = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`${API_URL}${notaId}/`, {
            headers: { Authorization: `Token ${token}` },
          });
          setFormData({
            tipo_nota: response.data.tipo_nota || "",
            recomendaciones: response.data.recomendaciones || "",
            proxima_cita: response.data.proxima_cita || "",
            observaciones: response.data.observaciones || "",
          });
        } catch (error) {
          console.error(error);
          alert("Error al cargar la nota clínica");
        }
      };
      fetchNota();
    }
  }, [notaId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!perfilId) return alert("ID de perfil no válido");

    try {
      const token = localStorage.getItem("token");
      if (notaId) {
        // Editar: PUT
        await axios.put(
          `${API_URL}${notaId}/`,
          { ...formData, perfil: perfilId },
          { headers: { Authorization: `Token ${token}` } }
        );
        alert("Nota clínica actualizada");
      } else {
        // Crear: POST
        await axios.post(
          API_URL,
          { ...formData, perfil: perfilId },
          { headers: { Authorization: `Token ${token}` } }
        );
        alert("Nota clínica guardada");
      }
      navigate(`/menu/${perfilId}/gineco/Modulos_Embarazo`);
    } catch (error) {
      console.error(error);
      alert("Error al guardar la nota clínica");
    }
  };

  const handleDelete = async () => {
    if (!notaId) return;
    const confirmDelete = window.confirm("¿Desea eliminar esta nota clínica?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}${notaId}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      alert("Nota clínica eliminada");
      navigate(`/menu/${perfilId}/gineco/Modulos_Embarazo`);
    } catch (error) {
      console.error(error);
      alert("Error al eliminar la nota clínica");
    }
  };

  return (
    <div className="nc-container">
      <nav className="navbar">
        <div className="navbar-logo">
          <span className="logo-med">Med</span>
          <span className="logo-pal">Pal</span>
        </div>
      </nav>

      <main className="main-wrap">
        <section className="card">
          <h1 className="title">{notaId ? "Editar Nota Clínica" : "Notas Clínicas"}</h1>

          <form className="grid-form" onSubmit={handleSubmit}>
            <div className="group">
              <label htmlFor="tipo_nota">Tipo de nota</label>
              <select
                id="tipo_nota"
                name="tipo_nota"
                value={formData.tipo_nota}
                onChange={handleChange}
                required
              >
                <option value="" disabled hidden>Seleccione</option>
                <option value="breve">Nota breve</option>
                <option value="seguimiento">Seguimiento</option>
                <option value="indicaciones">Indicaciones</option>
              </select>
            </div>

            <div className="group">
              <label htmlFor="recomendaciones">Recomendaciones</label>
              <select
                id="recomendaciones"
                name="recomendaciones"
                value={formData.recomendaciones}
                onChange={handleChange}
                required
              >
                <option value="" disabled hidden>Seleccione</option>
                <option value="dieta">Dieta</option>
                <option value="reposo">Reposo</option>
                <option value="actividad_ligera">Actividad ligera</option>
              </select>
            </div>

            <div className="group">
              <label htmlFor="proxima_cita">Próxima cita</label>
              <select
                id="proxima_cita"
                name="proxima_cita"
                value={formData.proxima_cita}
                onChange={handleChange}
              >
                <option value="" disabled hidden>Seleccione</option>
                <option value="mañana">Mañana</option>
                <option value="proxima_semana">Próxima semana</option>
                <option value="proximo_mes">Próximo mes</option>
              </select>
            </div>

            <div className="group full-width">
              <label htmlFor="observaciones">Observaciones</label>
              <textarea
                id="observaciones"
                name="observaciones"
                rows="3"
                value={formData.observaciones}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="action">
              <button type="submit">{notaId ? "Actualizar" : "Guardar"}</button>
              <button type="button" onClick={() => navigate(-1)}>Cancelar</button>
              {notaId && <button type="button" onClick={handleDelete} className="delete-btn">Eliminar</button>}
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
