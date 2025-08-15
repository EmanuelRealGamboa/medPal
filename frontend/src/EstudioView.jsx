import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './EstudioView.css';

export default function EstudioView() {
  const { perfilId } = useParams(); // Obtiene el perfilId de la URL
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [estudios, setEstudios] = useState({
    gabinete: null,
    laboratorio: null,
    funcional: null,
  });

  useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }

    // Aquí puedes agregar la lógica para cargar los estudios usando perfilId si lo necesitas
    // Por ahora solo se obtiene el perfilId y el token
  }, [token, perfilId, navigate]);

  const renderCard = (tipo, nombre, descripcion, data) => (
    <div key={tipo} className="estudio-card">
      <h3>{nombre}</h3>
      <p>{descripcion}</p>
      {data ? (
        <>
          <ul className="list-group list-group-flush mb-2 w-100">
            {Object.entries(data).map(([key, value]) =>
              key !== 'id' && value !== null && value !== '' && (
                <li className="list-group-item text-center" key={key}>
                  <strong className="text-capitalize">{key.replace(/([A-Z])/g, ' $1')}:</strong> {value}
                </li>
              )
            )}
          </ul>
          <button
            className="btn btn-warning mt-2"
            onClick={() => navigate(`/menu/${perfilId}/estudios/${tipo}/editar-eliminar/${data.id}`)}
          >
            Editar
          </button>
        </>
      ) : (
        <button
          className="btn btn-primary"
          onClick={() => {
            if (tipo === 'laboratorio') {
              navigate(`/menu/${perfilId}/estudios/laboratorio/lista`);
            } else if (tipo === 'gabinete') {
              navigate(`/menu/${perfilId}/estudios/gabinete/lista`);
            } else if (tipo === 'funcional') {
              navigate(`/menu/${perfilId}/estudios/funcional/lista`);
            } else {
              navigate(`/menu/${perfilId}/estudios/${tipo}`);
            }
          }}
        >
          visualizar
        </button>
      )}
    </div>
  );

  return (
    <div className="perfil-estudios">
      <div className="custom-navbar">
        <h5 className="mb-0">MedPal</h5>
        <span>Estudios</span>
      </div>
      <div className="main-layout p-4">
        <h3 className="mb-2 text-center text-white"></h3>
        <div className="estudio-container">
          {renderCard('gabinete', 'Estudio Gabinete', 'Estudios de gabinete realizados', estudios.gabinete)}
          {renderCard('laboratorio', 'Estudio Laboratorio', 'Estudios de laboratorio realizados', estudios.laboratorio)}
          {renderCard('funcional', 'Estudio Funcional', 'Estudios funcionales realizados', estudios.funcional)}
        </div>
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-secondary" onClick={() => navigate(`/menu/${perfilId}`)}>
          ← Volver al menú
        </button>
      </div>

      <div className="custom-footer">
        &copy; 2025 MedPal - Todos los derechos reservados
      </div>

    </div>
  );
}