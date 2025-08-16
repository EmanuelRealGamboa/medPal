import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Embarazo.css";

export default function EmbarazoView() {
  const { perfilId } = useParams();
  const navigate = useNavigate();
  const API_URL = "http://127.0.0.1:8000/api/embarazo/";

  const [embarazo, setEmbarazo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmbarazo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}?perfil=${perfilId}`, {
          headers: { Authorization: `Token ${token}` },
        });
        // Suponemos que solo hay un registro por perfil
        setEmbarazo(response.data.length > 0 ? response.data[0] : null);
      } catch (error) {
        console.error(error);
        alert("Error al cargar los datos de embarazo");
      } finally {
        setLoading(false);
      }
    };

    fetchEmbarazo();
  }, [perfilId]);

  if (loading) return <p>Cargando...</p>;

  if (!embarazo) return <p>No hay datos de embarazo registrados.</p>;

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
          <h1 className="title">Datos de Embarazo</h1>

          <div className="grid-view">
            <div className="group">
              <label>Fecha del último período:</label>
              <span>{embarazo.fum}</span>
            </div>

            <div className="group">
              <label>Fecha probable de parto:</label>
              <span>{embarazo.fpp}</span>
            </div>

            <div className="group">
              <label>Nivel de riesgo:</label>
              <span>{embarazo.riesgo}</span>
            </div>

            <div className="group">
              <label>Intervenciones:</label>
              <span>{embarazo.intervenciones}</span>
            </div>

            <div className="action">
              <button
                onClick={() =>
                  navigate(
                    `/menu/${perfilId}/gineco/Modulos_Embarazo/Datos_Embarazo/editar/${embarazo.id}`
                  )
                }
              >
                Editar
              </button>
              <button onClick={() => navigate(-1)}>Volver</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
