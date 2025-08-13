import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./MenuModulos.css";
import "bootstrap/dist/css/bootstrap.min.css";

const MenuModulos = () => {
  const navigate = useNavigate();
  const { id: perfilId } = useParams(); // <- obtenemos el id del perfil desde la URL

  const sections = [
    { label: "Datos personales", color: "#E04040", icon: "/icons/personales.png", path: `/menu/${perfilId}/datos-personales` },
    { label: "Antecedentes médicos", color: "#FF9455", icon: "/icons/antecedentes.png" },
    { label: "Vacunas", color: "#FCE536", icon: "/icons/vacunas.png", path: `/menu/${perfilId}/vacunas` },
    { label: "Estudios", color: "#ACEB8A", icon: "/icons/estudios.png" },
    { label: "Recetas", color: "#71C4FF", icon: "/icons/recetas.png" },
    { label: "Historia gineco-obstétrica", color: "#E091FB", icon: "/icons/gineco.png" },
    { label: "Seguimiento de enfermedades crónicas degenerativas", color: "#FF7DB5", icon: "/icons/enfermedades.png" },
    { label: "Oftalmología", color: "#76EEC6", icon: "/icons/oftalmologia.png", path: `/menu/${perfilId}/oftalmologia` },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
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

      {/* Grid de módulos */}
      <main className="section-grid">
        {sections.map((section, index) => (
          <div key={index} className="module-container">
            {section.path ? (
              <Link to={section.path} className="link-reset" style={{ width: "100%" }}>
                <div className="section-card" style={{ backgroundColor: section.color }}>
                  <img src={section.icon} alt={section.label} className="module-icon" />
                </div>
              </Link>
            ) : (
              <div className="section-card" style={{ backgroundColor: section.color }}>
                <img src={section.icon} alt={section.label} className="module-icon" />
              </div>
            )}
            <div className="module-label">{section.label}</div>
          </div>
        ))}

        {/* Botón regresar a perfil */}
        <div className="back-button-container px-4 mt-3">
          <Link to="/perfiles" className="btn btn-secondary">
            ← Regresar a perfil
          </Link>
        </div>
      </main>

      <footer className="footer-bar">© 2025 MedPal</footer>
    </div>
  );
};

export default MenuModulos;
