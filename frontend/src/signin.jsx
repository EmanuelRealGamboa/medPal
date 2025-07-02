import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signin.css';

function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/accounts/signin/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) throw new Error('Error en el inicio de sesión');
      const data = await response.json();
      localStorage.setItem('token', data.token);
      navigate('/perfiles');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <h2 className="mb-4">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Correo"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <div className="input-group mb-3">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={togglePasswordVisibility}
              tabIndex={-1}
            >
              <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i>
            </button>
          </div>

          <button type="submit" className="btn btn-custom w-100">Iniciar Sesión</button>
        </form>
      </div>
      <div className="auth-right">
        <h2>¡MedPal!</h2>
        <p>Tu compañero en cada paso de tu bienestar.</p>
        <Link to="/signup" className="btn btn-custom mt-3">Registrarse</Link>
      </div>
    </div>
  );
}

export default Signin;
