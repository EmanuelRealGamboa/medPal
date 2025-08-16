import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NotasClinicas.css";

export default function NotasClinicasView() {
  const { perfilId } = useParams();
  const navigate = useNavigate();
  const API_URL = `http://127.0.0.1:8000/api/notas-clinicas/?perfil=${perfilId}`;

  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotas = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Token ${token}` },
        });
        setNotas(response.data);
      } catch (error) {
        console.error(error);
        alert("Error al cargar las notas clínicas");
      } finally {
        setLoading(false);
      }
    };
    fetchNotas();
  }, [API_URL]);

  if (loading) return <p className="text-center mt-4">Cargando notas...</p>;

  return (
    <div className="container mt-4">
      {/* Navbar */}
      <nav className="navbar bg-light mb-4 rounded shadow-sm p-3">
        <span className="navbar-brand mb-0 h1">
          <span className="text-primary fw-bold">Med</span>
          <span className="text-success fw-bold">Pal</span>
        </span>
      </nav>

      {/* Card */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="card-title mb-4">Notas Clínicas Registradas</h1>

          {notas.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-bordered align-middle">
                <thead className="table-primary">
                  <tr>
                    <th>Tipo de nota</th>
                    <th>Recomendaciones</th>
                    <th>Próxima cita</th>
                    <th>Observaciones</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {notas.map((nota) => (
                    <tr key={nota.id}>
                      <td>{nota.tipo_nota}</td>
                      <td>{nota.recomendaciones}</td>
                      <td>{nota.proxima_cita || "—"}</td>
                      <td>{nota.observaciones || "—"}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() =>
                            navigate(`/menu/${perfilId}/gineco/notas-clinicas/${nota.id}/edit`)
                          }
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No hay notas clínicas registradas</p>
          )}

          {/* Botón de volver */}
          <div className="mt-3">
            <button
              className="btn btn-secondary"
              onClick={() => navigate(`/menu/${perfilId}/gineco/Modulos_Embarazo`)}
            >
              Volver al módulo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
