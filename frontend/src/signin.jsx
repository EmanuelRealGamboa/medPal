import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signin.css';

function Signin() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    apellido_paterno: '',
    apellido_materno: '',
    phone: '',
    email: '',
    password: '',
    password2: ''
  });

  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      apellido_paterno: '',
      apellido_materno: '',
      phone: '',
      email: '',
      password: '',
      password2: ''
    });
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const endpoint = isLogin
      ? 'http://127.0.0.1:8000/accounts/signin/'
      : 'http://127.0.0.1:8000/accounts/signup/';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al procesar la solicitud');
      }

      const data = await response.json();
      console.log(isLogin ? 'Inicio de sesión exitoso:' : 'Registro exitoso:', data);

      // ✅ Aquí diferenciamos la redirección
      if (isLogin) {
        navigate('/index'); // Ruta a la que se redirige al iniciar sesión
      } else {
        navigate('/verificacion'); // Ruta para verificar código tras registrarse
      }

    } catch (error) {
      console.error('Error:', error.message);
      alert('Hubo un error. Revisa tus datos e inténtalo de nuevo.');
    }
  };

  return (
    <div className={`container ${isLogin ? '' : 'active'}`}>
      <div className="form-container">
        <div className="form-content">
          <h2>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <input
                  type="text"
                  placeholder="Nombre"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  placeholder="Apellido Paterno"
                  name="apellido_paterno"
                  value={formData.apellido_paterno}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  placeholder="Apellido Materno"
                  name="apellido_materno"
                  value={formData.apellido_materno}
                  onChange={handleChange}
                  required
                />
                <input
                  type="tel"
                  placeholder="Teléfono"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </>
            )}
            <input
              type="email"
              placeholder="Correo"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {!isLogin && (
              <input
                type="password"
                placeholder="Confirmar Contraseña"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                required
              />
            )}
            <button type="submit">{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</button>
          </form>
        </div>
        <div className="side-panel">
          <h2>{isLogin ? '¡MedPal!' : '¡MedPal!'}</h2>
          <p>
            {isLogin
              ? 'Tu compañero en cada paso de tu bienestar.'
              : 'Tu compañero en cada paso de tu bienestar.'}
          </p>
          <button onClick={toggleForm}>
            {isLogin ? 'Registrarse' : 'Iniciar Sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signin;
