import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ModuloGineco.css";

const ModuloGineco = () => {
  const navigate = useNavigate();
  const { perfilId } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);

  const sections = [
    { label: "Registro Menstrual", color: "#FF5CA2", path: `/menu/${perfilId}/gineco/registro-menstrual`  },
    { label: "Seguimiento de Embarazos", color: "#E3B4EC", path: `/menu/${perfilId}/gineco/Modulos_Embarazo` }
  ];

  return (
    <div className="gineco-container">
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

      {/* Sección de módulos */}
      <main className="section-grid">
        {sections.map((section, index) => (
          <div key={index} className="module-container">
            <Link to={section.path} className="link-reset" style={{ width: "100%" }}>
              <div
                className="section-card"
                style={{ backgroundColor: section.color }}
              >
                <i className="bi bi-heart-pulse fs-1 text-white"></i>
              </div>
            </Link>
            <div className="module-label">{section.label}</div>
          </div>
        ))}

        {/* Botón regresar */}
        <div className="back-button-container">
          <Link to={`/menu/${perfilId}`} className="btn btn-secondary">
            ← Regresar al menú principal
          </Link>
        </div>
      </main>

      <footer className="footer-bar">© 2025 MedPal</footer>
    </div>
  );
};

export default ModuloGineco;
