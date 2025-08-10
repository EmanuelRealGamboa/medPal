import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './FormAlergias.css';

export default function FormAlergias() {
    const navigate = useNavigate();
    const { perfilId } = useParams();
    const [form, setForm] = useState({
        tipo: '',
        reaccion: '',
        fechaPrimerEvento: '',
        frecuencia: ''
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
                'http://127.0.0.1:8000/antecedentesMedicos/Alergias/',
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

            <main className="form-section d-flex justify-content-center align-items-center py-4">
                <div className="form-card p-4 rounded shadow-sm custom-width">
                    <h3>Alergias</h3>

                    {error && <div className="alert alert-danger">{error}</div>}
                    {cargando && <div className="alert alert-info">Guardando...</div>}

                    <form onSubmit={handleSubmit}>
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
                            name="reaccion"
                            value={form.reaccion}
                            onChange={handleChange}
                            placeholder="Reacción"
                            required
                        />
                        <input
                            className="form-control mb-2"
                            type="date"
                            name="fechaPrimerEvento"
                            value={form.fechaPrimerEvento}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="form-control mb-2"
                            name="frecuencia"
                            value={form.frecuencia}
                            onChange={handleChange}
                            placeholder="Frecuencia"
                            required
                        />
                        <button className="btn btn-success" disabled={cargando}>
                            {cargando ? 'Guardando...' : 'Guardar'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
