import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './FormPersonalesNoPatologicos.css';

export default function FormPersonalesNoPatologicos() {
    const navigate = useNavigate();
    const { perfilId } = useParams();
    const [form, setForm] = useState({
        tabaquismo: '',
        alcohol: '',
        actividadFisica: '',
        alimentacion: '',
        saludMental: '',
        suenio: ''
    });

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (!perfilId) {
            alert('ID de perfil no definido');
            return;
        }

        setCargando(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');

            await axios.post(
                'http://127.0.0.1:8000/antecedentesMedicos/personalesNoPatologicos/',
                { ...form, perfil: perfilId },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            alert('Guardado correctamente');
            navigate(`/menu/${perfilId}/antecedentes-medicos`);
        } catch (err) {
            console.error(err);
            setError('Error al guardar los datos. Intenta nuevamente.');
        } finally {
            setCargando(false);
        }
    };

    if (!perfilId) {
        return <p className="text-danger text-center mt-4">Error: perfilId no definido</p>;
    }

    const etiquetas = {
        tabaquismo: 'Tabaquismo',
        alcohol: 'Consumo de alcohol',
        actividadFisica: 'Actividad física',
        alimentacion: 'Alimentación',
        saludMental: 'Salud mental',
        suenio: 'Sueño'
    };

    return (
        <div className="main-layout">
            {/* Navbar */}
            <nav className="custom-navbar d-flex justify-content-between align-items-center px-4 py-2">
                <h4 className="text-light m-0">
                    <i className="bi bi-person-circle me-2"></i>MedPal
                </h4>
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        navigate('/signin');
                    }}
                    className="btn btn-outline-light"
                >
                    Logout
                </button>
            </nav>
            <main className="form-section d-flex flex-column justify-content-start align-items-center py-4">
                 <h3 className="form-title mb-4 text-center">Antecedentes Personales No Patológicos</h3>

                {error && <div className="alert alert-danger">{error}</div>}
                {cargando && <div className="alert alert-info">Guardando...</div>}

                <form onSubmit={handleSubmit} className="grid-form-3">
                    {Object.keys(form).map((key) => (
                        <div key={key} className="form-item">
                            <label className="form-label">{etiquetas[key]}</label>
                            <textarea
                                className="form-control"
                                name={key}
                                value={form[key]}
                                onChange={handleChange}
                                placeholder={`Describe ${etiquetas[key].toLowerCase()}`}
                                required
                            />
                        </div>
                    ))}

                    <div className="form-buttons">
                        <button className="btn btn-success" disabled={cargando}>
                            {cargando ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </main>


            <footer className="footer-bar mt-5">© 2025 MedPal</footer>
        </div>
    );
}
