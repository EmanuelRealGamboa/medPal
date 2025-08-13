import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './FormLaboratorio.css'; // Para estilos personalizados

export default function EstudioLaboratorioForm() {
  const navigate = useNavigate();
  const API_URL = "http://127.0.0.1:8000/api/estudios/laboratorio/";

  const [formData, setFormData] = useState({
    nombre: "",
    fecha_muestra: "",
    laboratorio: "",
    tecnica: "",
    valores: "",
    archivo_pdf: null,
    accion_medica: "",
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) data.append(key, formData[key]);

    try {
      await axios.post(API_URL, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Estudio de laboratorio guardado correctamente");
      navigate(-1);
    } catch (error) {
      console.error(error);
      alert("Error al guardar el estudio de laboratorio");
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="custom-navbar d-flex justify-content-between align-items-center px-4 py-2">
        <h4 className="text-light m-0">
          <i className="bi bi-person-circle me-2"></i>MedPal
        </h4>
        <button onClick={handleLogout} className="btn btn-outline-light">
          Logout
        </button>
      </nav>

      {/* Formulario */}
      <form className="laboratorio-form" onSubmit={handleSubmit}>
        <h2>Nuevo Estudio de Laboratorio</h2>

        <div className="grid-container">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="fecha_muestra"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="laboratorio"
            placeholder="Laboratorio"
            onChange={handleChange}
            required
          />

          <textarea
            name="tecnica"
            placeholder="Técnica"
            onChange={handleChange}
          />
          <textarea
            name="valores"
            placeholder="Valores"
            onChange={handleChange}
            required
          />

          <div>
            <label>PDF</label>
            <input
              type="file"
              name="archivo_pdf"
              accept="application/pdf"
              onChange={handleChange}
            />
          </div>

          <textarea
            name="accion_medica"
            placeholder="Acción médica"
            onChange={handleChange}
            className="accion-medica"
          />
        </div>

        <div className="buttons-container">
          <button type="submit" className="submit-btn">Guardar</button>
          <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Cancelar</button>
        </div>
      </form>

      {/* Footer */}
      <footer className="custom-footer text-center text-light py-2">
        © 2025 MedPal
      </footer>
    </>
  );
}
