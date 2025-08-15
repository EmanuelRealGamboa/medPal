import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ConsultaEmbarazo.css";

export default function ConsultaEmbarazoView() {
  const { perfilId } = useParams();
  const navigate = useNavigate();
  const API_URL = `http://127.0.0.1:8000/gineco/checks/`;
  const [consultas, setConsultas] = useState([]);

  const getConsultas = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}?perfil=${perfilId}`, {
        headers: { Authorization: `Token ${token}` },
      });
      setConsultas(res.data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar las consultas");
    }
  };

  const deleteConsulta = async (id) => {
    if (!window.confirm("¿Eliminar esta consulta?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      alert("Consulta eliminada");
      getConsultas();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar la consulta");
    }
  };

  useEffect(() => {
    getConsultas();
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
          <h1 className="title">Consultas de embarazo</h1>
          <button
            className="add-btn"
            onClick={() => navigate(`/menu/${perfilId}/gineco/consulta_embarazo/nueva`)}
          >
            + Agregar consulta
          </button>

          {consultas.length === 0 ? (
            <p>No hay consultas registradas</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Mes Gestacional</th>
                  <th>Peso</th>
                  <th>Presión</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {consultas.map((c) => (
                  <tr key={c.id}>
                    <td>{c.mes_gestacional}</td>
                    <td>{c.peso}</td>
                    <td>{c.presion_arterial}</td>
                    <td>
                      <button
                        onClick={() =>
                          navigate(`/menu/${perfilId}/gineco/consulta_embarazo/${c.id}/editar`)
                        }
                      >
                        Editar
                      </button>
                      <button onClick={() => deleteConsulta(c.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}
