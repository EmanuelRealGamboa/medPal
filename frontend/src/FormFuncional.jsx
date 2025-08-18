import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom"; // ← Importa useParams
import './FormFuncional.css';

export default function EstudioFuncionalForm() {
  const API_URL = "http://127.0.0.1:8000/api/estudios/funcionales/";
  const navigate = useNavigate();
  const { perfilId } = useParams(); // ← Obtiene el perfilId de la URL

  const [formData, setFormData] = useState({
    nombre: "",
    fecha: "",
    tipo_estudio: "",
    duracion: "",
    hallazgos: "",
    archivo_pdf: null,
    video: null,
    interpretacion_automatica: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: files ? files[0] : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!perfilId) {
      alert("ID de perfil no válido. No se puede guardar.");
      return;
    }
    const data = new FormData();
    for (const key in formData) data.append(key, formData[key]);
    data.append("perfil", perfilId); // ← Agrega el perfilId al formulario

    try {
      const token = localStorage.getItem('token');
      await axios.post(API_URL, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });
      alert("Estudio funcional guardado correctamente");
      navigate(`/menu/${perfilId}/estudios`);
    } catch (error) {
      console.error(error);
      alert("Error al guardar el estudio funcional");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
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
      <form className="funcional-form" onSubmit={handleSubmit}>
        <h2>Nuevo Estudio Funcional</h2>

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
            name="fecha"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="tipo_estudio"
            placeholder="Tipo de estudio"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="duracion"
            placeholder="Duración"
            onChange={handleChange}
          />
          <textarea
            name="hallazgos"
            placeholder="Hallazgos"
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
          <div>
            <label>Video</label>
            <input
              type="file"
              name="video"
              accept="video/*"
              onChange={handleChange}
            />
          </div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="interpretacion_automatica"
              checked={formData.interpretacion_automatica}
              onChange={handleChange}
            />
            Interpretación automática
          </label>
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
    </div>
  );
}