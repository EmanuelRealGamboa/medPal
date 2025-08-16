import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ChronicConditionList() {
  const [conditions, setConditions] = useState([]);
  const { perfilId } = useParams();
  const navigate = useNavigate();
  const API_URL = `http://127.0.0.1:8000/chronic-conditions/?perfil=${perfilId}`;

  useEffect(() => {
    fetchConditions();
  }, [perfilId]);

  const fetchConditions = async () => {
    try {
      const res = await axios.get(API_URL);
      setConditions(res.data);
    } catch (err) {
      console.error("Error al obtener condiciones:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este registro?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/chronic-conditions/${id}/`);
        fetchConditions(); // recargar después de eliminar
      } catch (err) {
        console.error("Error al eliminar:", err);
      }
    }
  };

  return (
    <div className="container mt-4 bg-white p-4 rounded shadow-sm">
      {/* Navbar */}
      <nav className="custom-navbar d-flex justify-content-between align-items-center px-4 py-2">
        <div className="navbar-brand d-flex align-items-center">
          <i className="bi bi-journal-medical fs-3 me-2"></i>
          <span className="logo-text">
            Med<span className="text-primary">Pal</span>
          </span>
        </div>
        <div className="ms-auto d-flex align-items-center">
          <button
            className="btn logout-btn me-2"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/signin");
            }}
          >
            Cerrar sesión
          </button>
          <i className="bi bi-person-circle fs-4"></i>
        </div>
      </nav>

      <h2>Condiciones Crónicas</h2>
      <button
        className="btn btn-primary mb-3"
        onClick={() =>
          navigate(`/menu/${perfilId}/Enfermedades_Cronicas/Agregar`)
        }
      >
        + Agregar nuevo
      </button>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Enfermedad</th>
            <th>Estado actual</th>
            <th>Fecha diagnóstico</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {conditions.length > 0 ? (
            conditions.map((c) => (
              <tr key={c.id}>
                <td>{c.disease_name}</td>
                <td>{c.current_status}</td>
                <td>{c.diagnosis_date}</td>
                <td className="text-center">
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() =>
                      navigate(
                        `/menu/${perfilId}/Enfermedades_Cronicas/Editar/${c.id}`
                      )
                    }
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(c.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                No hay registros
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <footer className="footer-bar">© 2025 MedPal</footer>
    </div>
  );
}
