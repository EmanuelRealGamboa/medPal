import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ResumenAntecedentes.css';

export default function ResumenAntecedentes() {
  const navigate = useNavigate();
  const { perfilId } = useParams();
  const token = localStorage.getItem('token');

  const [datos, setDatos] = useState({
    personalesPatologicos: null,
    personalesNoPatologicos: null,
    heredoFamiliares: null,
    Alergias: null,
    Intolerancias: null,
  });

  useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Token ${token}` };

        const [
          patologicos,
          noPatologicos,
          heredo,
          alergias,
          intolerancias,
        ] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/antecedentesMedicos/personalesPatologicos/?perfil=${perfilId}`, { headers }),
          axios.get(`http://127.0.0.1:8000/antecedentesMedicos/personalesNoPatologicos/?perfil=${perfilId}`, { headers }),
          axios.get(`http://127.0.0.1:8000/antecedentesMedicos/heredoFamiliares/?perfil=${perfilId}`, { headers }),
          axios.get(`http://127.0.0.1:8000/antecedentesMedicos/Alergias/?perfil=${perfilId}`, { headers }),
          axios.get(`http://127.0.0.1:8000/antecedentesMedicos/Intolerancias/?perfil=${perfilId}`, { headers }),
        ]);

        setDatos({
          personalesPatologicos: patologicos.data[0] || null,
          personalesNoPatologicos: noPatologicos.data[0] || null,
          heredoFamiliares: heredo.data[0] || null,
          Alergias: alergias.data[0] || null,
          Intolerancias: intolerancias.data[0] || null,
        });
      } catch (error) {
        console.error('Error al cargar antecedentes:', error);
      }
    };

    fetchData();
  }, [token, perfilId, navigate]);

  const renderCard = (titulo, data, subRuta) => (
    <div className="col-md-4 mb-4" key={subRuta}>
      <div className="card h-100 shadow-sm">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{titulo}</h5>
          {data ? (
            <>
              <ul className="list-group list-group-flush mb-3 flex-grow-1">
                {Object.entries(data).map(([key, value]) =>
                  key !== 'id' && value !== null && value !== '' ? (
                    <li className="list-group-item" key={key}>
                      <strong className="text-capitalize">{key.replace(/([A-Z])/g, ' $1')}:</strong> {value}
                    </li>
                  ) : null
                )}
              </ul>
              <button
                className="btn btn-warning mt-auto"
                onClick={() => navigate(`/menu/${perfilId}/antecedentes-medicos/${subRuta}/editar-eliminar/${data.id}`)}
              >
                Editar
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary mt-auto"
              onClick={() => navigate(`/menu/${perfilId}/antecedentes-medicos/${subRuta}`)}
            >
              Agregar
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Navbar fijo arriba */}
      <nav className="custom-navbar fixed-top bg-success text-white d-flex align-items-center px-4" style={{ height: '60px', zIndex: 1050 }}>
        <h5 className="mb-0">MedPal</h5>
      </nav>

      {/* Contenedor principal con padding para navbar y footer */}
      <div className="container" style={{ paddingTop: '70px', paddingBottom: '70px' }}>
        <h2 className="mb-4 text-center">Antecedentes Médicos</h2>
        <div className="row">
          {renderCard('Antecedentes Personales Patológicos', datos.personalesPatologicos, 'patologicos')}
          {renderCard('Antecedentes Personales No Patológicos', datos.personalesNoPatologicos, 'no-patologicos')}
          {renderCard('Antecedentes Heredofamiliares', datos.heredoFamiliares, 'heredo-familiares')}
          {renderCard('Alergias', datos.Alergias, 'alergias')}
          {renderCard('Intolerancias', datos.Intolerancias, 'intolerancias')}
        </div>
        <div className="text-center mt-4">
          <button className="btn btn-secondary" onClick={() => navigate(`/menu/${perfilId}`)}>
            ← Volver al menú
          </button>
        </div>
      </div>

      {/* Footer fijo abajo */}
      <footer className="footer fixed-bottom bg-success text-white d-flex justify-content-center align-items-center" style={{ height: '40px', zIndex: 1050 }}>
        &copy; 2025 MedPal - Todos los derechos reservados
      </footer>
    </>
  );
}
