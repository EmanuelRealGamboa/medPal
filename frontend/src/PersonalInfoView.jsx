import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './PersonalInfoView.css';

export default function PersonalInfoView({ perfilId }) {
  const navigate = useNavigate();
  const { id } = useParams(); // por si se necesita
  const token = localStorage.getItem('token');
  const [data, setData] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const personalRes = await axios.get('http://127.0.0.1:8000/accounts/personal-data/', {
          headers: { Authorization: `Token ${token}` }
        });

        const userRes = await axios.get('http://127.0.0.1:8000/accounts/users/', {
          headers: { Authorization: `Token ${token}` }
        });

        const currentUser = userRes.data.find(u => u.email === JSON.parse(atob(token.split('.')[1])).email);

        if (!personalRes.data || Object.keys(personalRes.data).length === 0) {
          setData(null);
        } else {
          setData({
            nombre: `${currentUser.name} ${currentUser.apellido_paterno} ${currentUser.apellido_materno}`,
            contactoEmergencia: currentUser.contactoEmergencia,
            grupoRH: currentUser.grupoRH,
            photoUser: currentUser.photoUser,
            fechaNacimiento: personalRes.data.fecha_nacimiento,
            sexo: personalRes.data.genero,
          });
        }
      } catch (error) {
        console.error(error);
        setMensaje('No se encontraron datos personales registrados.');
        setData(null);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="perfil-bg">
      {/* Navbar fijo arriba */}
      <div className="custom-navbar">
        <h5 className="mb-0">MedPal</h5>
        <span>Datos personales</span>
      </div>

      {/* Contenido principal */}
      <div className="main-layout p-4">
        <h3 className="mb-4 text-center">Datos personales</h3>

        {data ? (
          <>
            {data.photoUser && (
              <div className="avatar-container">
                <img src={data.photoUser} alt="Foto de perfil" className="avatar-img" />
              </div>
            )}
            <div className="perfil-wrapper">
              <p><strong>Nombre completo:</strong> {data.nombre}</p>
              <p><strong>Fecha de nacimiento:</strong> {data.fechaNacimiento}</p>
              <p><strong>Sexo:</strong> {data.sexo}</p>
              <p><strong>Grupo RH:</strong> {data.grupoRH}</p>
              <p><strong>Contacto emergencia:</strong> {data.contactoEmergencia}</p>
            </div>

            <div className="d-flex gap-3 justify-content-center mt-4">
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/menu/${perfilId}/datos-personales/editar`)}
              >
                Editar
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => alert("Detalle no implementado aún")}
              >
                Ver detalle
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-muted text-center">No hay datos personales registrados.</p>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-success"
                onClick={() => navigate(`/menu/${perfilId}/datos-personales/agregar`)}
              >
                Agregar
              </button>
            </div>
          </>
        )}

        {mensaje && <div className="alert alert-warning mt-3">{mensaje}</div>}
      </div>

      {/* Footer fijo abajo */}
      <div className="custom-footer">
        &copy; 2025 MedPal - Todos los derechos reservados
      </div>
    </div>
  );
}
