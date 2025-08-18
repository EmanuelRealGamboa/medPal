import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EstudioView.css';  // tu CSS para las cards y estilos

export default function EstudioView() {
  const { perfilId } = useParams();
  const navigate = useNavigate();

  const estudios = [
    { tipo: 'gabinete', nombre: 'Estudio Gabinete', descripcion: 'Estudios de gabinete realizados' },
    { tipo: 'laboratorio', nombre: 'Estudio Laboratorio', descripcion: 'Estudios de laboratorio realizados' },
    { tipo: 'funcional', nombre: 'Estudio Funcional', descripcion: 'Estudios funcionales realizados' },
  ];

  const handleRedirect = (tipo) => {
    navigate(`/menu/${perfilId}/estudios/${tipo}`);
  };

  return (
    <div className="perfil-estudios">
      {/* Navbar */}
      <div className="custom-navbar">
        <h5 className="mb-0">MedPal</h5>
        <span>Estudios</span>
      </div>

      {/* Contenido principal */}
      <div className="main-layout p-4">
        <h3 className="mb-4 text-center"></h3>

        <div className="estudio-container">
          {estudios.map(({ tipo, nombre, descripcion }) => (
            <div key={tipo} className="estudio-card">
              <h3>{nombre}</h3>
              <p>{descripcion}</p>
              <button onClick={() => handleRedirect(tipo)}>Abrir formulario</button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="custom-footer">
        &copy; 2025 MedPal - Todos los derechos reservados
      </div>
    </div>
  );
}
