import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './FormHeredoFamiliares.css';

export default function EditDeleteHeredoFamiliares() {
    const { perfilId, heredoFamiliares_id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nombreEnfermedad: '',
        parentesco: '',
        tipoEnfermedad: '',
        edadDiacnosticoEnfermedad: '',
        estadoActual: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `http://127.0.0.1:8000/antecedentesMedicos/heredoFamiliares/?perfil=${perfilId}/`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setForm(response.data);
            } catch (err) {
                console.error(err);
                setError('Error al cargar los datos');
            }
        };
        fetchData();
    }, [heredoFamiliares_id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://127.0.0.1:8000/antecedentesMedicos/heredoFamiliares/${heredoFamiliares_id}/`,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            alert('Actualizado correctamente');
            navigate(`/menu/${perfilId}/antecedentes-medicos`);
        } catch (err) {
            console.error(err);
            setError('Error al actualizar');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('¿Estás seguro de eliminar este registro?')) return;

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `http://127.0.0.1:8000/antecedentesMedicos/heredoFamiliares/${heredoFamiliares_id}/`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            alert('Eliminado correctamente');
            navigate(`/menu/${perfilId}/antecedentes-medicos`);
        } catch (err) {
            console.error(err);
            setError('Error al eliminar');
        } finally {
            setLoading(false);
        }
    };

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
                    <h3>Editar / Eliminar Heredo Familiares</h3>

                    {error && <div className="alert alert-danger">{error}</div>}
                    {loading && <div className="alert alert-info">Procesando...</div>}

                    <form onSubmit={handleEdit}>
                        <input
                            className="form-control mb-2"
                            name="nombreEnfermedad"
                            value={form.nombreEnfermedad}
                            onChange={handleChange}
                            placeholder="Nombre de la enfermedad"
                            required
                        />
                        <input
                            className="form-control mb-2"
                            name="parentesco"
                            value={form.parentesco}
                            onChange={handleChange}
                            placeholder="Parentesco"
                            required
                        />
                        <textarea
                            className="form-control mb-2"
                            name="tipoEnfermedad"
                            value={form.tipoEnfermedad}
                            onChange={handleChange}
                            placeholder="Tipo de enfermedad"
                            required
                        />
                        <input
                            className="form-control mb-2"
                            type="number"
                            name="edadDiacnosticoEnfermedad"
                            value={form.edadDiacnosticoEnfermedad}
                            onChange={handleChange}
                            placeholder="Edad diagnóstico"
                            required
                        />
                        <input
                            className="form-control mb-2"
                            name="estadoActual"
                            value={form.estadoActual}
                            onChange={handleChange}
                            placeholder="Estado actual"
                            required
                        />
                        <div className="d-flex justify-content-between">
                            <button className="btn btn-primary" disabled={loading}>
                                Guardar Cambios
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                Eliminar
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
