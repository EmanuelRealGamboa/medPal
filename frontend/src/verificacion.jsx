import React, { useState } from 'react';
import './verificacion.css';
import axios from 'axios';

export default function Verificacion() {
  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita recarga del formulario
    try {
      const response = await axios.post('http://localhost:8000/api/verificar/', {
        codigo: codigo
      });

      if (response.data.status === 'ok') {
        setMensaje('✅ Código verificado correctamente');
      } else {
        setMensaje('❌ Código incorrecto');
      }
    } catch (error) {
      setMensaje('❌ Error al verificar el código');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Verifica tu cuenta</h2>
        <p className="subtitle">Introduce el código que enviamos a tu correo.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Código de verificación"
              required
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
          </div>
          <button className="btn-login" type="submit">Verificar</button>
        </form>
        {mensaje && <p style={{ marginTop: '15px', color: '#333' }}>{mensaje}</p>}
      </div>
    </div>
  );
}
