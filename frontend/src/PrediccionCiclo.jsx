// PrediccionCiclo.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PrediccionCiclo.css";

function getHighlightedDates(start, end) {
  const dates = [];
  let current = new Date(start);
  const endDate = new Date(end);
  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

// Comparar fechas solo por año, mes y día
function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export default function PrediccionCiclo() {
  const { perfilId } = useParams();
  const navigate = useNavigate();

  const [prediccion, setPrediccion] = useState(null);
  const [ultimoRegistro, setUltimoRegistro] = useState(null);
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrediccion() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://127.0.0.1:8000/gineco/menstrual/${perfilId}/prediccion/`,
          { headers: { Authorization: `Token ${token}` } }

        ).then(r => r.json());

        if (res.prediccion) {
          setPrediccion(res.prediccion);
          setUltimoRegistro(res.ultimo_registro);

          if (res.prediccion.fecha_inicio && res.prediccion.fecha_fin) {
            const fechas = getHighlightedDates(
              res.prediccion.fecha_inicio,
              res.prediccion.fecha_fin
            );
            setHighlightedDates(fechas);
          }
        }

        setLoading(false);

      } catch (error) {
        console.error("Error al obtener la predicción:", error);
        setLoading(false);
      }
    };


    fetchPrediccion();
  }, [perfilId]);

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      return highlightedDates.some(d => isSameDay(d, date)) ? "highlight" : null;
    }
  };

  if (loading) return <p className="text-center mt-4">Cargando predicción...</p>;

  return (
    <div
      className="container mt-5 prediccion-container p-4 shadow rounded"
      style={{ maxWidth: "500px", backgroundColor: "#ffffff" }}
    >
      <h2 className="text-center mb-3">Predicción del Ciclo</h2>


      {prediccion ? (
        <>
          <div className="mb-3 text-center">
            <p>
              <strong>Inicio estimado:</strong> {prediccion.fecha_inicio}
            </p>
            <p>
              <strong>Fin estimado:</strong> {prediccion.fecha_fin}
            </p>
          </div>

          <div className="calendar-container mb-4">
            <Calendar tileClassName={tileClassName} />
          </div>

          <button
            className="btn btn-success w-100"
            onClick={() =>
              navigate(
                `/menu/${perfilId}/gineco/registro-menstrual?registroId=${ultimoRegistro?.id || ""
                }`
              )
            }
          >
            Volver a calcular
          </button>
        </>
      ) : (
        <p className="text-center text-danger">No se pudo obtener la predicción.</p>

      )}
    </div>
  );
}
