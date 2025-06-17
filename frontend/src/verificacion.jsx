import React, { useState, useEffect, useRef } from 'react';
import './verificacion.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Verificacion() {
  const [codigo, setCodigo] = useState(Array(6).fill(''));
  const [mensaje, setMensaje] = useState('');
  const [mensajeTemporal, setMensajeTemporal] = useState('');
  const [timer, setTimer] = useState(120);
  const [showOptions, setShowOptions] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = localStorage.getItem('correo_verificacion') || '';
  const inputsRef = useRef([]);

  // 🔐 Redireccionar si no hay email
  useEffect(() => {
    if (!email) {
      navigate('/');
    }
  }, [email, navigate]);

  // Mensaje de éxito desde registro
  useEffect(() => {
    if (location.state?.mensaje) {
      setMensajeTemporal(location.state.mensaje);
      navigate(location.pathname, { replace: true });
      const temp = setTimeout(() => setMensajeTemporal(''), 4000);
      return () => clearTimeout(temp);
    }
  }, [location, navigate]);

  // Temporizador
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setShowOptions(true);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newCodigo = [...codigo];
      newCodigo[index] = value;
      setCodigo(newCodigo);
      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && codigo[index] === '' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = codigo.join('');
    setMensaje('');

    if (fullCode.length < 6) {
      setMensaje('❌ Ingresa el código completo.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/accounts/verify/', {
        email,
        code: fullCode
      });

      if (response.data.status === 'ok') {
        setMensaje('✅ Código verificado correctamente');
        localStorage.removeItem('correo_verificacion'); // ✅ limpiar
        setTimeout(() => navigate('/'), 1500);
      } else {
        setMensaje('❌ Código incorrecto');
      }
    } catch (error) {
      setMensaje('❌ Error al verificar el código');
    }
  };

  const reenviarCodigo = async () => {
    setMensaje('');
    try {
      const response = await axios.post('http://localhost:8000/accounts/resend-code/', { email });

      if (response.data.status === 'ok') {
        setMensaje('📧 Código reenviado a tu correo');
        setCodigo(Array(6).fill(''));
        setTimer(120);
        setShowOptions(false);
      } else {
        setMensaje('❌ No se pudo reenviar el código');
      }
    } catch (error) {
      setMensaje('❌ Error al reenviar el código');
    }
  };

  return (
    <div className="container login-container d-flex justify-content-center align-items-center">
      <div className="login-card">
        <h2>Verifica tu cuenta</h2>
        <p className="subtitle">Introduce el código que enviamos a tu correo.</p>
        <p className="email-visualizado">✉️ <strong>{email}</strong></p>

        {mensajeTemporal && (
          <div className="status-message status-success">{mensajeTemporal}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="code-box">
            {codigo.map((digit, index) => (
              <input
                key={index}
                ref={(el) => inputsRef.current[index] = el}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="verification-input"
              />
            ))}
          </div>
          <button className="btn-login mt-3" type="submit">Verificar</button>
        </form>

        <p className="timer">⏳ Tiempo restante: <strong>{formatTime(timer)}</strong></p>

        {mensaje && (
          <div className={`status-message ${mensaje.includes('✅') ? 'status-success' : 'status-error'}`}>
            {mensaje}
          </div>
        )}

        {showOptions && (
          <div className="d-flex justify-content-center mt-3 flex-wrap">
            <button className="btn-secondary me-2 mb-2" onClick={reenviarCodigo}>Reenviar código</button>
            <button className="btn-secondary mb-2" onClick={() => {
              localStorage.removeItem('correo_verificacion');
              navigate('/');
            }}>Volver al inicio</button>
          </div>
        )}
      </div>
    </div>
  );
}
