// ModuloEmbarazo.jsx
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ModuloEmbarazo.css";

const ModuloEmbarazo = () => {
  const navigate = useNavigate();
  const { perfilId } = useParams();

  const sections = [
    { label: "Datos principales", color: "#FF7DB5", path: `/menu/${perfilId}/gineco/Modulos_Embarazo/Datos_Embarazo` },
    { label: "Chequeo prenatal", color: "#E091FB", path: `/menu/${perfilId}/gineco/Modulos_Embarazo/Consulta_Embarazo` },
    { label: "Registro de notas", color: "#FCE536", path: `/menu/${perfilId}/gineco/Modulos_Embarazo/notas-clinicas` },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/signin");
  }, [navigate]);

  return (
    <div className="modulo-medpal">
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
      <main className="modulo-embarazo-body container py-5">
        <div className="row justify-content-center g-4 embarazo-grid">
          {sections.map((section, index) => (
            <div key={index} className="col-12 col-sm-6 col-md-4 d-flex flex-column align-items-center">
              <div
                className={`embarazo-card`}
                style={{ backgroundColor: section.color, height: "100px", cursor: "pointer", width: "180px" }}
                onClick={() => navigate(section.path)}
              ></div>
              <div className="embarazo-label mt-2 text-center">{section.label}</div>
            </div>
          ))}
        </div>

        {/* Botón regresar a Menu Gineco */}
        <div className="mt-4 text-center">
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/menu/${perfilId}/gineco`)}
          >
            ← Regresar a Menu Gineco
          </button>
        </div>
      </main>

      <footer className="footer-bar text-center py-2">© 2025 MedPal</footer>
    </div>
  );
};

export default ModuloEmbarazo;
