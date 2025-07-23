import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PersonalInfoView.css';

export default function PersonalInfoView() {
  const navigate = useNavigate();
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

        setData({
          nombre: `${currentUser.name} ${currentUser.apellido_paterno} ${currentUser.apellido_materno}`,
          contactoEmergencia: currentUser.contactoEmergencia,
          grupoRH: currentUser.grupoRH,
          photoUser: currentUser.photoUser,
          fechaNacimiento: personalRes.data.fecha_nacimiento,
          sexo: personalRes.data.genero,
        });
      } catch (error) {
        setMensaje('Error al cargar datos');
        console.error(error);
      }
    }
    fetchData();
  }, []);

  if (!data) return <p>Cargando datos...</p>;

  return (
    <div className="main-layout p-4">
      <h3>Datos personales</h3>

      <div>
        {data.photoUser && <img src={data.photoUser} alt="Foto de perfil" style={{ maxWidth: '150px' }} />}
      </div>
      <p><strong>Nombre completo:</strong> {data.nombre}</p>
      <p><strong>Fecha de nacimiento:</strong> {data.fechaNacimiento}</p>
      <p><strong>Sexo:</strong> {data.sexo}</p>
      <p><strong>Grupo RH:</strong> {data.grupoRH}</p>
      <p><strong>Contacto emergencia:</strong> {data.contactoEmergencia}</p>

      {mensaje && <div className="alert alert-danger">{mensaje}</div>}

      <div className="d-flex gap-3 mt-3">
        <button className="btn btn-primary" onClick={() => navigate('/menu/datos-personales/form')}>
          Editar
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/menu/datos-personales/detail')}>
          Ver detalle
        </button>
      </div>
    </div>
  );
}
