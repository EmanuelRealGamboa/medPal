import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    name: '', apellido_paterno: '', apellido_materno: '',
    phone: '', email: '', password: '', password2: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (formData.password !== formData.password2) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/accounts/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error en el registro');
      }

      // ✅ Guardamos correo temporal para verificación
      localStorage.setItem('correo_verificacion', formData.email);

      setMensaje('¡Registro exitoso!');
      setTimeout(() => {
        navigate('/verificacion', {
          state: { mensaje: '¡Registro exitoso! Revisa tu correo.' }
        });
      }, 1500);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-right">
        <h2>¡MedPal!</h2>
        <p>Tu compañero en cada paso de tu bienestar.</p>
        <Link to="/" className="btn btn-custom mt-3">Iniciar Sesión</Link>
      </div>

      <div className="auth-left">
        <h2 className="mb-3">Registrarse</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Nombre" className="form-control mb-2" value={formData.name} onChange={handleChange} required />
          <input type="text" name="apellido_paterno" placeholder="Apellido Paterno" className="form-control mb-2" value={formData.apellido_paterno} onChange={handleChange} required />
          <input type="text" name="apellido_materno" placeholder="Apellido Materno" className="form-control mb-2" value={formData.apellido_materno} onChange={handleChange} required />
          <input type="tel" name="phone" placeholder="Teléfono" className="form-control mb-2" value={formData.phone} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Correo" className="form-control mb-2" value={formData.email} onChange={handleChange} required />

          {/* Contraseña */}
          <div className="input-group mb-2">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Contraseña"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(prev => !prev)}
              tabIndex={-1}
            >
              <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i>
            </button>
          </div>

          {/* Confirmar contraseña */}
          <div className="input-group mb-3">
            <input
              type={showPassword2 ? 'text' : 'password'}
              name="password2"
              placeholder="Confirmar Contraseña"
              className="form-control"
              value={formData.password2}
              onChange={handleChange}
              required
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword2(prev => !prev)}
              tabIndex={-1}
            >
              <i className={`bi ${showPassword2 ? 'bi-eye' : 'bi-eye-slash'}`}></i>
            </button>
          </div>

          <button type="submit" className="btn btn-custom w-100">Registrarse</button>
        </form>

        {/* Alertas */}
        {mensaje && <div className="alert alert-success mt-3">{mensaje}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
}

export default Signup;
