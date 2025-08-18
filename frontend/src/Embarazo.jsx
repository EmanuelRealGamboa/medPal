import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./Embarazo.css";

export default function EmbarazoForm({ editMode = false }) {
  const { perfilId, embarazoId } = useParams();
  const navigate = useNavigate();
  const API_URL = "http://127.0.0.1:8000/menstrual/";         // Para Menstrual si lo necesitas
  const API_URL_PREG = "http://127.0.0.1:8000/pregnancies/";  // Para Pregnancy

  const [formData, setFormData] = useState({
    fum: "",
    fpp: "",
    riesgo: "",
    intervenciones: "",
  });

  useEffect(() => {
    if (editMode && embarazoId) {
      const token = localStorage.getItem("token");
      axios
        .get(`${API_URL_PREG}${embarazoId}/`, { headers: { Authorization: `Token ${token}` } })
        .then((res) => setFormData(res.data))
        .catch((err) => console.error(err));
    }
  }, [editMode, embarazoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!perfilId) return alert("ID de perfil no válido");

    const token = localStorage.getItem("token");
    try {
      if (editMode && embarazoId) {
        await axios.put(`${API_URL_PREG}${embarazoId}/`, formData, { headers: { Authorization: `Token ${token}` } });
        alert("Datos de embarazo actualizados");
      } else {
        await axios.post(API_URL_PREG, { ...formData, perfil: perfilId }, { headers: { Authorization: `Token ${token}` } });
        alert("Datos de embarazo guardados");
      }
      navigate(`/menu/${perfilId}/gineco/Modulos_Embarazo`);
    } catch (error) {
      console.error(error);
      alert("Error al guardar los datos de embarazo");
    }
  };

  const handleDelete = async () => {
    if (!embarazoId) return;
    const confirmDelete = window.confirm("¿Desea eliminar este registro de embarazo?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL_PREG}${embarazoId}/`, { headers: { Authorization: `Token ${token}` } });
      alert("Registro eliminado");
      navigate(`/menu/${perfilId}/gineco/Modulos_Embarazo`);
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el registro");
    }
  };

  return (
    <div className="preg-container">
      <nav className="navbar">
        <div className="navbar-logo">
          <span className="logo-med">Med</span>
          <span className="logo-pal">Pal</span>
        </div>
      </nav>

      <main className="main-wrap">
        <section className="card">
          <h1 className="title">{editMode ? "Editar Embarazo" : "Embarazo"}</h1>

          <form className="grid-form" onSubmit={handleSubmit}>
            <div className="group">
              <label htmlFor="fum">Fecha del último período</label>
              <input id="fum" name="fum" type="date" value={formData.fum} onChange={handleChange} required/>
            </div>

            <div className="group">
              <label htmlFor="fpp">Fecha probable de parto</label>
              <input id="fpp" name="fpp" type="date" value={formData.fpp} onChange={handleChange} required/>
            </div>

            <div className="group">
              <label htmlFor="riesgo">Nivel de riesgo</label>
              <select id="riesgo" name="riesgo" value={formData.riesgo} onChange={handleChange} required>
                <option value="" disabled hidden>Seleccione</option>
                <option value="bajo">Bajo</option>
                <option value="medio">Medio</option>
                <option value="alto">Alto</option>
              </select>
            </div>

            <div className="group">
              <label htmlFor="intervenciones">Intervenciones</label>
              <select id="intervenciones" name="intervenciones" value={formData.intervenciones} onChange={handleChange} required>
                <option value="" disabled hidden>Seleccione</option>
                <option value="ninguna">Ninguna</option>
                <option value="control">Controles</option>
                <option value="medicacion">Medicación</option>
                <option value="otros">Otros</option>
              </select>
            </div>

            <div className="action">
              <button type="submit">{editMode ? "Actualizar" : "Guardar"}</button>
              <button type="button" onClick={() => navigate(-1)}>Cancelar</button>
              {editMode && <button type="button" onClick={handleDelete} className="delete-btn">Eliminar</button>}
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
