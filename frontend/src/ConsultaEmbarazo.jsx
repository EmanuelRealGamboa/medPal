import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./ConsultaEmbarazo.css";

export default function ConsultaEmbarazoForm() {
  const { perfilId, consultaId } = useParams();
  const navigate = useNavigate();
  const API_URL = `http://127.0.0.1:8000/gineco/checks/`;

  const [formData, setFormData] = useState({
    mes_gestacional: "",
    peso: "",
    presion_arterial: "",
    frecuencia_cardiaca: "",
    sintomas: "",
    estado_emocional: "",
    movimientos_fetales: "",
    ultrasonido: "",
    observaciones: "",
  });

  const getConsulta = async () => {
    if (!consultaId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}${consultaId}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setFormData(res.data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar la consulta");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!perfilId) return alert("ID de perfil no válido");

    try {
      const token = localStorage.getItem("token");
      if (consultaId) {
        await axios.put(`${API_URL}${consultaId}/`, { ...formData, perfil: perfilId }, {
          headers: { Authorization: `Token ${token}` },
        });
        alert("Consulta actualizada");
      } else {
        await axios.post(API_URL, { ...formData, perfil: perfilId }, {
          headers: { Authorization: `Token ${token}` },
        });
        alert("Consulta creada");
      }
      navigate(`/menu/${perfilId}/gineco/Modulos_Embarazo`);
    } catch (error) {
      console.error(error);
      alert("Error al guardar la consulta");
    }
  };

  useEffect(() => {
    getConsulta();
  }, []);

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
          <h1 className="title">{consultaId ? "Editar consulta" : "Nueva consulta"}</h1>

          <form className="grid-form" onSubmit={handleSubmit}>
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="group">
                <label htmlFor={key}>{key.replace(/_/g, " ")}</label>
                <input
                  id={key}
                  name={key}
                  type="text"
                  value={value}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <div className="action">
              <button type="submit">Guardar</button>
              <button type="button" onClick={() => navigate(-1)}>Cancelar</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
