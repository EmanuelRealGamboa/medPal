import React, { useState, useEffect } from 'react';
import './verificacion.css';
import axios from 'axios';

export default function Verificacion() {
  const [codigo, setCodigo] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    // Recupera el correo del localStorage (deberías haberlo guardado ahí después del signup)
    const emailGuardado = localStorage.getItem('email_verificacion');
    if (emailGuardado) {
      setEmail(emailGuardado);
    } else {
      setMensaje('❌ No se encontró el correo. Regístrate de nuevo.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/verificar/', {
        email: email,
        code: codigo
      });

      if (response.data.status === 'ok') {
        setMensaje('✅ Cuenta verificada correctamente');
        // Limpia el localStorage y redirige si quieres
        localStorage.removeItem('email_verificacion');
        // window.location.href = '/login'; // redirige si quieres
      } else {
        setMensaje('❌ Código incorrecto');
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setMensaje('❌ ' + Object.values(error.response.data.errors).join(' '));
      } else {
        setMensaje('❌ Error al verificar el código');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Verifica tu cuenta</h2>
        <p className="subtitle">Introduce el código que enviamos a <strong>{email}</strong>.</p>

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