import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './PerfilList.css';

export default function PerfilList() {
  const [perfiles, setPerfiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPerfiles();
  }, []);

  const fetchPerfiles = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/accounts/perfiles/', {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      });
      setPerfiles(response.data);
    } catch (error) {
      console.error("Error al cargar perfiles:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const colores = ['#a3d2ca', '#f7d9d9', '#b5ead7', '#e4c1f9', '#caffbf'];

  return (
    <div className="perfil-bg">
      {/* Navbar personalizada */}
      <nav className="custom-navbar d-flex justify-content-between align-items-center px-4 py-2">
        <h4 className="text-light m-0">
          <i className="bi bi-person-circle me-2"></i>MedPal
        </h4>
        <button onClick={handleLogout} className="btn btn-outline-light">
          Logout
        </button>
      </nav>

      {/* Contenido de perfiles */}
      <div className="perfil-container-horizontal">
        {perfiles.map((perfil, index) => (
          <Link
            to={`/perfiles/${perfil.id}`}
            key={perfil.id}
            className="perfil-card"
            style={{ backgroundColor: colores[index % colores.length] }}
          >
            <div className="perfil-nombre">{perfil.nombre}</div>
            <div className="perfil-relacion">{perfil.relacion}</div>
          </Link>
        ))}
        <Link to="/perfiles/nuevo" className="agregar-perfil">
          <span>+</span>
        </Link>
      </div>

      {/* Footer */}
      <footer className="custom-footer text-center text-light py-2">
        © 2025 MedPal 
      </footer>
    </div>
  );
}
