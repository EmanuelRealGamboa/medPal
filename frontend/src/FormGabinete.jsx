import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import './FormGabinete.css';  // Importamos el CSS personalizado

export default function EstudioGabineteForm() {
  const navigate = useNavigate();
  const { perfilId } = useParams(); // ← Obtiene el perfilId de la URL

  const API_URL = "http://127.0.0.1:8000/api/estudios/gabinete/";

  const [formData, setFormData] = useState({
    nombre: "",
    fecha_realizacion: "",
    centro_medico: "",
    motivo_clinico: "",
    resultado: "",
    archivo_pdf: null,
    imagenes: null,
    video: null,
    observaciones: "",
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
    if (!perfilId) {
      alert("ID de perfil no válido. No se puede guardar.");
      return;
    }
    const data = new FormData();
    for (const key in formData) {
      // Solo agrega archivos si hay uno seleccionado
      if (
        (key === "archivo_pdf" || key === "imagenes" || key === "video") &&
        !formData[key]
      ) {
        continue;
      }
      data.append(key, formData[key]);
    }
    data.append("perfil", perfilId);

    try {
      const token = localStorage.getItem('token');
      await axios.post(API_URL, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });
      alert("Estudio de gabinete guardado correctamente");
      navigate(`/menu/${perfilId}/estudios`);
    } catch (error) {
      console.error('Error al guardar:', error.response?.data || error);
      alert(JSON.stringify(error.response?.data)); // Muestra el error del backend
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
      <form className="gabinete-form" onSubmit={handleSubmit}>
        <h2>Nuevo Estudio de Gabinete</h2>

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
            name="fecha_realizacion"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="centro_medico"
            placeholder="Centro médico"
            onChange={handleChange}
            required
          />

          <textarea
            name="motivo_clinico"
            placeholder="Motivo clínico"
            onChange={handleChange}
            required
          />
          <textarea
            name="resultado"
            placeholder="Resultado"
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
            <label>Imagen</label>
            <input
              type="file"
              name="imagenes"
              accept="image/*"
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

          <textarea
            name="observaciones"
            placeholder="Observaciones"
            onChange={handleChange}
            className="observaciones"
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