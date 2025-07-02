import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PerfilDetail.css';

export default function PerfilDetail({ perfilId }) {
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/accounts/perfiles/${perfilId}/`, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      })
      .then((res) => setPerfil(res.data))
      .catch(() => setError('No se pudo cargar el perfil.'));
  }, [perfilId]);

  const handleEliminar = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/accounts/perfiles/${perfilId}/`, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      });
      navigate('/perfiles');
    } catch {
      setError('No se pudo eliminar el perfil.');
    }
  };

  const handleDescargar = () => {
    const data = {
      nombre: perfil.nombre,
      relacion: perfil.relacion,
      fecha_nacimiento: perfil.fecha_nacimiento
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `perfil_${perfilId}.json`;
    link.click();
  };

  if (error) {
    return <div className="alert alert-danger mt-4 text-center">{error}</div>;
  }

  if (!perfil) {
    return <div className="text-center mt-5">Cargando perfil...</div>;
  }

  return (
    <div className="container perfil-detail mt-5 mb-5">
      <h2 className="text-center mb-4">Detalle del Perfil</h2>

      <ul className="list-group mb-4">
        <li className="list-group-item"><strong>Nombre:</strong> {perfil.nombre}</li>
        <li className="list-group-item"><strong>Relación:</strong> {perfil.relacion}</li>
        <li className="list-group-item"><strong>Fecha de nacimiento:</strong> {perfil.fecha_nacimiento}</li>
      </ul>

      <div className="text-center d-flex justify-content-center flex-wrap gap-2">
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate(`/perfiles/${perfilId}/editar`)}
        >
          Editar
        </button>

        <button className="btn btn-outline-danger" onClick={() => setShowModal(true)}>
          Eliminar
        </button>

        <button className="btn btn-outline-success" onClick={handleDescargar}>
          Descargar
        </button>

        <button className="btn btn-secondary" onClick={() => navigate('/perfiles')}>
          Volver a la lista
        </button>
      </div>

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar eliminación</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas eliminar este perfil?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={handleEliminar}>
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
