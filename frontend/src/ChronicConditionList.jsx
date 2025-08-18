import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ChronicConditionList() {
  const [conditions, setConditions] = useState([]);
  const { perfilId } = useParams();
  const navigate = useNavigate();
  const API_URL = `http://127.0.0.1:8000/api/chronic/chronic-conditions/?perfil=${perfilId}`;

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Token ${token}` };

  useEffect(() => {
    fetchConditions();
  }, [perfilId]);

  const fetchConditions = async () => {
    try {
      const res = await axios.get(API_URL, { headers });
      setConditions(res.data);
    } catch (err) {
      console.error("Error al obtener condiciones:", err.response?.data || err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este registro?")) return;
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/chronic/chronic-conditions/${id}/`,
        { headers }
      );
      fetchConditions();
    } catch (err) {
      console.error("Error al eliminar:", err.response?.data || err);
    }
  };

  // Función para asignar color según estado
  const getStatusBadge = (status) => {
    switch (status) {
      case "CONTROLLED":
        return <span className="badge bg-success">Controlado</span>;
      case "POORLY_CONTROLLED":
        return <span className="badge bg-danger">Mal controlado</span>;
      case "REMISSION":
        return <span className="badge bg-primary">En remisión</span>;
      case "PROGRESSIVE":
        return <span className="badge bg-warning text-dark">Progresivo</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
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
            <th>Edad al diagnóstico</th>
            <th>Institución</th>
            <th>Doctor</th>
            <th>Sistema clasificación</th>
            <th>Nivel clasificación</th>
            <th>Activo</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {conditions.length > 0 ? (
            conditions.map((c) => (
              <tr key={c.id}>
                <td>{c.disease_name}</td>
                <td>{getStatusBadge(c.current_status)}</td>
                <td>{c.diagnosis_date}</td>
                <td>{c.age_at_diagnosis}</td>
                <td>{c.diagnosing_institution || '-'}</td>
                <td>{c.diagnosing_physician || '-'}</td>
                <td>{c.classification_system || '-'}</td>
                <td>{c.classification_level || '-'}</td>
                <td>{c.is_active ? 'Sí' : 'No'}</td>
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
              <td colSpan="10" className="text-center text-muted">
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
