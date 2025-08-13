import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function EditarEliminarPersonalesPatologicos() {
  const { perfilId, id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    nombreEnfermedad: '',
    fechaDiagnostico: '',
    intervenciones: '',
    intervencionesFecha: '',
    intervencionesMotivo: '',
    intervencionesLugar: '',
    hospitalizacion: '',
    hospitalizacionFecha: '',
    hospitalizacionMotivo: '',
    hospitalizacionLugar: '',
    hospitalizacionTratamientos: '',
    tratamientos: '',
    nombreTratamientos: '',
    dosisTratamientos: '',
    reaccionesTratamientos: '',
    frecuenciaTratamientos: '',
    perfil: perfilId // agregar perfil aquí para que siempre se envíe
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const etiquetas = {
    nombreEnfermedad: 'Nombre de enfermedad',
    fechaDiagnostico: 'Fecha de diagnóstico',
    intervenciones: '¿Tuvo intervenciones quirúrgicas?',
    intervencionesFecha: 'Fecha de intervención',
    intervencionesMotivo: 'Motivo de intervención',
    intervencionesLugar: 'Lugar de intervención',
    hospitalizacion: '¿Tuvo hospitalización?',
    hospitalizacionFecha: 'Fecha de hospitalización',
    hospitalizacionMotivo: 'Motivo de hospitalización',
    hospitalizacionLugar: 'Lugar de hospitalización',
    hospitalizacionTratamientos: 'Tratamientos recibidos en hospital',
    tratamientos: '¿Sigue en tratamiento?',
    nombreTratamientos: 'Nombre del tratamiento',
    dosisTratamientos: 'Dosis',
    reaccionesTratamientos: 'Reacciones secundarias',
    frecuenciaTratamientos: 'Frecuencia del tratamiento',
    perfil: 'Perfil (no editable)'
  };

  // Función para convertir fecha ISO a formato compatible input date/datetime-local
  const formatDateForInput = (dateStr, isDateTime = false) => {
    if (!dateStr) return '';
    if (isDateTime) {
      // Para datetime-local, cortar segundos y zona horaria si existiera
      return dateStr.substring(0, 16);
    } else {
      // Para date solo cortar YYYY-MM-DD
      return dateStr.substring(0, 10);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchData = async () => {
      try {
        setError('');
        const res = await axios.get(
          `http://127.0.0.1:8000/antecedentesMedicos/personalesPatologicos/${id}/?perfil=${perfilId}`,
          {
            headers: { Authorization: `Token ${token}` }
          }
        );

        // Ajustar fechas para inputs
        const data = res.data;
        setForm({
          ...data,
          fechaDiagnostico: formatDateForInput(data.fechaDiagnostico, false),
          intervencionesFecha: formatDateForInput(data.intervencionesFecha, true),
          hospitalizacionFecha: formatDateForInput(data.hospitalizacionFecha, true),
          perfil: perfilId // asegurar que perfil esté en el estado
        });
      } catch (err) {
        console.error(err);
        setError('Error al cargar los datos.');
      }
    };

    if (id) fetchData();
  }, [id, perfilId, navigate, token]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      // Enviar datos asegurando perfil incluido
      await axios.put(
        `http://127.0.0.1:8000/antecedentesMedicos/personalesPatologicos/${id}/?perfil=${perfilId}`,
        form,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setSuccessMsg('Datos actualizados correctamente.');
      setTimeout(() => navigate(`/menu/${perfilId}/antecedentes-medicos`), 1500);
    } catch (err) {
      console.error(err);
      setError('Error al actualizar los datos. Revisa los datos ingresados.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este registro?')) return;

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await axios.delete(
        `http://127.0.0.1:8000/antecedentesMedicos/personalesPatologicos/${id}/?perfil=${perfilId}`,
        {
          headers: { Authorization: `Token ${token}` }
        }
      );
      setSuccessMsg('Registro eliminado correctamente.');
      setTimeout(() => navigate(`/menu/${perfilId}/antecedentes-medicos`), 1500);
    } catch (err) {
      console.error(err);
      setError('Error al eliminar el registro.');
    } finally {
      setLoading(false);
    }
  };

  // Define qué campos son date o datetime-local según tu modelo Django
  // fechaDiagnostico es DateField, intervencionesFecha y hospitalizacionFecha son DateTimeField
  const dateFields = ['fechaDiagnostico'];
  const dateTimeFields = ['intervencionesFecha', 'hospitalizacionFecha'];

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Editar / Eliminar Personales Patológicos</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {loading && <div className="alert alert-info">Procesando...</div>}

      <form onSubmit={handleUpdate}>
        {Object.keys(form).map((key) => {
          // No permitir editar perfil porque es clave foránea
          if (key === 'perfil') {
            return (
              <div key={key} className="mb-3">
                <label className="form-label">{etiquetas[key]}</label>
                <input
                  className="form-control"
                  name={key}
                  value={form[key]}
                  readOnly
                />
              </div>
            );
          }

          let inputType = 'text';
          if (dateFields.includes(key)) inputType = 'date';
          else if (dateTimeFields.includes(key)) inputType = 'datetime-local';

          return (
            <div key={key} className="mb-3">
              <label htmlFor={key} className="form-label">{etiquetas[key]}</label>
              <input
                id={key}
                name={key}
                type={inputType}
                className="form-control"
                value={form[key] || ''}
                onChange={handleChange}
                required={key === 'nombreEnfermedad' || key === 'fechaDiagnostico'} // solo requeridos ejemplo
              />
            </div>
          );
        })}

        <div className="d-flex justify-content-between">
          <button className="btn btn-success" type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>

          <button className="btn btn-danger" type="button" onClick={handleDelete} disabled={loading}>
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>

          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => navigate(`/menu/${perfilId}/antecedentes-medicos`)}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
