import React from 'react';
import { useNavigate } from 'react-router-dom';

function Index() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token
    navigate('/'); // Redirige al login ("/signin" si lo prefieres)
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-3">¡Bienvenido a MedPal!</h1>
      <p className="mb-4">Has iniciado sesión correctamente.</p>
      <button className="btn btn-primary" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default Index;
