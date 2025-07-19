import React from "react";
import "./Dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";

const sections = [
  { label: "Datos personales", color: "#E74C3C" },
  { label: "Antecedentes médicos", color: "#F39C12" },
  { label: "Vacunas", color: "#F9E79F" },
  { label: "Estudios", color: "#ABEBC6" },
  { label: "Recetas", color: "#85C1E9" },
  { label: "Historia gineco-obstétrica", color: "#D7BDE2" },
  { label: "Seguimiento de enfermedades crónicas degenerativas", color: "#F5B7B1" },
  { label: "Oftalmología", color: "#76EEC6" },
];

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <nav className="navbar navbar-expand-lg navbar-light custom-navbar px-4">
        <div className="navbar-brand d-flex align-items-center">
          <i className="bi bi-journal-medical fs-3 me-2"></i>
          <span className="logo-text">Med<span className="text-primary">Pal</span></span>
        </div>
        <div className="ms-auto d-flex align-items-center">
          <button className="btn logout-btn me-2">Cerrar sesión</button>
          <i className="bi bi-person-circle fs-4"></i>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row g-4 justify-content-center">
          {sections.map((section, index) => (
            <div key={index} className="col-6 col-md-3">
              <div
                className="section-card text-center text-dark fw-semibold"
                style={{ backgroundColor: section.color }}
              >
                {section.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer-bar"></footer>
    </div>
  );
};

export default Dashboard;
