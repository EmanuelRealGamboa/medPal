import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './FormHeredoFamiliares.css';

export default function FormHeredoFamiliares() {
    const navigate = useNavigate();
    const { perfilId } = useParams();
    const [form, setForm] = useState({
        nombreEnfermedad: '',
        parentesco: '',
        tipoEnfermedad: '',
        edadDiacnosticoEnfermedad: '',
        estadoActual: ''
    });

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!perfilId) {
            alert("ID de perfil no válido. No se puede guardar.");
            return;
        }

        setCargando(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');

            await axios.post(
                'http://127.0.0.1:8000/antecedentesMedicos/heredoFamiliares/',
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
            setError('Error al guardar. Intenta nuevamente.');
        } finally {
            setCargando(false);
        }
    };

    if (!perfilId) {
        return <p className="text-center mt-5 text-danger">Error: perfilId no está definido</p>;
    }

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
                <h3 className="form-heredo mb-4 text-center">Heredo Familiares</h3>

                {error && <div className="alert alert-danger">{error}</div>}
                {cargando && <div className="alert alert-info">Guardando...</div>}

                <form className="form-heredo-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <input
                            className="form-control"
                            name="nombreEnfermedad"
                            value={form.nombreEnfermedad}
                            onChange={handleChange}
                            placeholder="Nombre de la enfermedad"
                            required
                        />
                        <input
                            className="form-control"
                            name="parentesco"
                            value={form.parentesco}
                            onChange={handleChange}
                            placeholder="Parentesco"
                            required
                        />
                    </div>
                    <div className="form-row">
                        <textarea
                            className="form-control"
                            name="tipoEnfermedad"
                            value={form.tipoEnfermedad}
                            onChange={handleChange}
                            placeholder="Tipo de enfermedad"
                            required
                        />
                        <input
                            className="form-control"
                            type="number"
                            name="edadDiacnosticoEnfermedad"
                            value={form.edadDiacnosticoEnfermedad}
                            onChange={handleChange}
                            placeholder="Edad diagnóstico"
                            required
                        />
                    </div>
                    <div className="form-row">
                        <input
                            className="form-control"
                            name="estadoActual"
                            value={form.estadoActual}
                            onChange={handleChange}
                            placeholder="Estado actual"
                            required
                        />
                    </div>
                    <button className="btn btn-success mt-3" disabled={cargando}>
                        {cargando ? 'Guardando...' : 'Guardar'}
                    </button>
                </form>


            </main>
            <footer className="footer-bar mt-5">© 2025 MedPal</footer>
        </div>
    );
}
