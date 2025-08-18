import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PrediccionCiclo.css";

export default function PrediccionCiclo() {
  const { perfilId } = useParams();
  const navigate = useNavigate();
  const [prediccion, setPrediccion] = useState(null);
  const [ultimoRegistro, setUltimoRegistro] = useState(null);

  useEffect(() => {
    async function fetchPrediccion() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://127.0.0.1:8000/gineco/menstrual/${perfilId}/prediccion/`,
          { headers: { Authorization: `Token ${token}` } }
        );
        setPrediccion(res.data.prediccion);
        setUltimoRegistro(res.data.ultimo_registro);
      } catch (error) {
        console.error("Error al obtener la predicción:", error);
      }
    }

    fetchPrediccion();
  }, [perfilId]);

  if (!prediccion) return <p>Cargando predicción...</p>;

  return (
    <div className="container mt-4 prediccion-container">
      <h2>Predicción del Ciclo</h2>
      <p>Fecha estimada de inicio: {prediccion.fecha_inicio}</p>
      <p>Fecha estimada de fin: {prediccion.fecha_fin}</p>

      {ultimoRegistro && (
        <button
          className="btn btn-warning"
          onClick={() =>
            navigate(`/menu/${perfilId}/gineco/registro-menstrual?registroId=${ultimoRegistro.id}`)
          }
        >
          Editar registro menstrual
        </button>
      )}
    </div>
  );
}
