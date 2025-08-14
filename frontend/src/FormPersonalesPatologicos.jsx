import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FormPersonalesPatologicos.css';

export default function FormPersonalesPatologicos({ perfilId }) {
    const navigate = useNavigate();

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
        frecuenciaTratamientos: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!perfilId) {
            alert('ID de perfil no definido');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');

            await axios.post(
                'http://127.0.0.1:8000/antecedentesMedicos/personalesPatologicos/',
                { ...form, perfil: perfilId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            alert('Datos guardados correctamente');
            navigate(`/menu/${perfilId}/antecedentes-medicos`);
        } catch (err) {
            console.error(err);
            setError('Error al guardar los datos. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

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
        frecuenciaTratamientos: 'Frecuencia del tratamiento'
    };

    return (
        <div className="form-patologicos">
            {/* Navbar */}
            <nav className="custom-navbar d-flex justify-content-between align-items-center px-4 py-2">
                <div className="navbar-brand d-flex align-items-center">
                    <i className="bi bi-journal-medical fs-3 me-2"></i>
                    <span className="logo-text">
                        Med<span className="text-primary">Pal</span>
                    </span>
                </div>
                <div className="ms-auto d-flex align-items-center">
                    <button
                        className="btn logout-btn me-2"
                        onClick={() => {
                            localStorage.removeItem('token');
                            navigate('/signin');
                        }}
                    >
                        Cerrar sesión
                    </button>
                    <i className="bi bi-person-circle fs-4"></i>
                </div>
            </nav>

            <main className="p-4">
                <h3 className="mb-4">Antecedentes Personales Patológicos</h3>

                {error && <div className="alert alert-danger">{error}</div>}
                {loading && <div className="alert alert-info">Guardando datos...</div>}

                <form onSubmit={handleSubmit}>
                    {Object.keys(form).map((key) => (
                        <div key={key} className="mb-3">
                            <label className="form-label">{etiquetas[key]}</label>
                            <input
                                className="form-control"
                                type={key.toLowerCase().includes('fecha') ? 'datetime-local' : 'text'}
                                name={key}
                                value={form[key]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}
                    <button className="btn btn-success" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </form>
            </main>

            <footer className="footer-bar mt-5">© 2025 MedPal</footer>
        </div>
    );
}
