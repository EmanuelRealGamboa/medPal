import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './PerfilList.css';

export default function PerfilList() {
  const [perfiles, setPerfiles] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
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

  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const obtenerAvatarUrl = (perfil) => {
    const edad = calcularEdad(perfil.fecha_nacimiento);
    const genero = perfil.genero;
    let semilla = perfil.nombre;
    let estilo = "fun-emoji";

    if (edad <= 5) {
      semilla += genero === 'F' ? '-bebeF' : '-bebeM';
    } else if (edad <= 12) {
      semilla += genero === 'F' ? '-niña' : '-niño';
    } else if (edad <= 20) {
      semilla += genero === 'F' ? '-jovenF' : '-jovenM';
    } else if (edad <= 60) {
      semilla += genero === 'F' ? '-mujer' : '-hombre';
    } else {
      semilla += genero === 'F' ? '-abuela' : '-abuelo';
    }

    return `https://api.dicebear.com/7.x/${estilo}/svg?seed=${encodeURIComponent(semilla)}`;
  };

  return (
    <div className="perfil-bg">
      <nav className="custom-navbar d-flex justify-content-between align-items-center px-4 py-2">
        <h4 className="text-light m-0">
          <i className="bi bi-person-circle me-2"></i>MedPal
        </h4>
        <button onClick={handleLogout} className="btn btn-outline-light">
          Logout
        </button>
      </nav>

      <div className="perfil-container-horizontal">
        {perfiles.map((perfil, index) => (
          <div key={perfil.id} className="perfil-wrapper position-relative">
            <div
              className="perfil-card"
              style={{ backgroundColor: colores[index % colores.length], cursor: 'pointer', position: 'relative' }}
              onClick={() => navigate(`/menu/${perfil.id}`)}
            >
              <div className="avatar-container">
                <img
                  src={obtenerAvatarUrl(perfil)}
                  alt={`Avatar de ${perfil.nombre}`}
                  className="avatar-img"
                />
              </div>

              {/* Icono de menú */}
              <div
                className="menu-icon"
                onClick={(e) => {
                  e.stopPropagation(); // Previene que se dispare el onClick del contenedor
                  setOpenMenu(openMenu === perfil.id ? null : perfil.id);
                }}
              >
                &#8942;
              </div>

              {/* Menú contextual */}
              {openMenu === perfil.id && (
                <div
                  className="context-menu"
                  onClick={(e) => e.stopPropagation()} // También lo previene dentro del menú
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Previene navegación al menú
                      navigate(`/perfiles/${perfil.id}`);
                    }}
                  >
                    Editar perfil
                  </button>
                </div>
              )}
            </div>

            <div className="perfil-info">
              <div className="perfil-nombre">{perfil.nombre}</div>
              <div className="perfil-relacion">{perfil.relacion}</div>
            </div>
          </div>
        ))}

        <Link to="/perfiles/nuevo" className="agregar-perfil">
          <span>+</span>
        </Link>
      </div>

      <footer className="custom-footer text-center text-light py-2">
        © 2025 MedPal
      </footer>
    </div>
  );
}
