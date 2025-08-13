import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './FormIntolerancias.css';

export default function FormIntolerancias() {
    const navigate = useNavigate();
    const { perfilId } = useParams();
    const [form, setForm] = useState({
        tipo: '',
        sintomas: '',
        diagnostico: ''
    });

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (!perfilId) {
            alert('ID de perfil no válido. No se puede guardar.');
            return;
        }

        setCargando(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');

            await axios.post(
                `http://127.0.0.1:8000/antecedentesMedicos/Intolerancias/`,
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
        return <p className="text-center text-danger mt-5">Error: perfilId no definido</p>;
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

                <h3 className="form-intolerancias mb-4 text-center">Intolerancias</h3>

                {error && <div className="alert alert-danger">{error}</div>}
                {cargando && <div className="alert alert-info">Guardando...</div>}

                <form className="form-intolerancia" onSubmit={handleSubmit}>
                    <textarea
                        className="form-control mb-2"
                        name="tipo"
                        value={form.tipo}
                        onChange={handleChange}
                        placeholder="Tipo"
                        required
                    />
                    <textarea
                        className="form-control mb-2"
                        name="sintomas"
                        value={form.sintomas}
                        onChange={handleChange}
                        placeholder="Síntomas"
                        required
                    />
                    <textarea
                        className="form-control mb-2"
                        name="diagnostico"
                        value={form.diagnostico}
                        onChange={handleChange}
                        placeholder="Diagnóstico"
                        required
                    />
                    <button className="btn btn-success" disabled={cargando}>
                        {cargando ? 'Guardando...' : 'Guardar'}
                    </button>
                </form>
                <footer className="footer-bar mt-5">© 2025 MedPal</footer>
            </main>
        </div>
    );
}
