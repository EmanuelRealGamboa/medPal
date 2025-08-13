import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function EditarEliminarIntolerancias() {
  const { perfilId, intoleranciaId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    tipo: '',
    sintomas: '',
    diagnostico: ''
  });

  useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchIntolerancia = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/antecedentesMedicos/Intolerancias/${intoleranciaId}/?perfil=${perfilId}`,
          {
            headers: {
              Authorization: `Token ${token}`
            }
          }
        );
        setForm(response.data);
      } catch (error) {
        console.error('Error al obtener la intolerancia:', error);
      }
    };

    if (intoleranciaId) {
      fetchIntolerancia();
    }
  }, [intoleranciaId, navigate, token]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async () => {
  try {
    await axios.put(
      `http://127.0.0.1:8000/antecedentesMedicos/Intolerancias/${intoleranciaId}/?perfil=${perfilId}`,
      form, 
      {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    navigate(`/menu/${perfilId}/antecedentes-medicos`);
  } catch (error) {
    console.error('Error al actualizar la intolerancia:', error.response?.data || error);
  }
};

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/antecedentesMedicos/Intolerancias/${intoleranciaId}/?perfil=${perfilId}`,
          {
            headers: {
              Authorization: `Token ${token}`
            }
          }
        );
      navigate(`/menu/${perfilId}/antecedentes-medicos`);
    } catch (error) {
      console.error('Error al eliminar la intolerancia:', error);
    }
  };

  return (
  <>
    <nav className="custom-navbar">
      <h5 className="mb-0 text-center w-100">MedPal</h5>
    </nav>

    <div className="container mt-3 mb-5" style={{ paddingTop: '70px', paddingBottom: '50px' }}>
      <h2 className="mb-4 text-center">Antecedentes Médicos</h2>
      <div className="row">
        {renderCard('Antecedentes Personales Patológicos', datos.personalesPatologicos, 'patologicos')}
        {renderCard('Antecedentes Personales No Patológicos', datos.personalesNoPatologicos, 'no-patologicos')}
        {renderCard('Antecedentes Heredofamiliares', datos.heredoFamiliares, 'heredo-familiares')}
        {renderCard('Alergias', datos.Alergias, 'alergias')}
        {renderCard('Intolerancias', datos.Intolerancias, 'intolerancias')}
      </div>
      <div className="text-center mt-4">
        <button className="btn btn-secondary" onClick={() => navigate(`/menu/${perfilId}`)}>
          ← Volver al menú
        </button>
      </div>
    </div>

    <footer className="footer">&copy; 2025 MedPal - Todos los derechos reservados</footer>
  </>
);
}
