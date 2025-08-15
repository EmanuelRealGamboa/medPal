import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './EditDeletFuncional.css';

export default function EditarEliminarFuncional() {
    const { perfilId, id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [form, setForm] = useState({
        nombre: "",
        fecha: "",
        tipo_estudio: "",
        duracion: "",
        hallazgos: "",
        archivo_pdf: null,
        video: null,
        interpretacion_automatica: false,
    });

    useEffect(() => {
        if (!token) {
            navigate('/signin');
            return;
        }

        const fetchFuncional = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/estudios/funcionales/${id}/?perfil=${perfilId}`,
                    {
                        headers: { Authorization: `Token ${token}` }
                    }
                );
                setForm(response.data);
            } catch (error) {
                console.error('Error al obtener el estudio funcional:', error);
            }
        };

        if (id) {
            fetchFuncional();
        }
    }, [id, navigate, perfilId, token]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "checkbox") {
            setForm({ ...form, [name]: checked });
        } else {
            setForm({ ...form, [name]: files ? files[0] : value });
        }
    };

    const handleUpdate = async () => {
        try {
            const data = new FormData();
            for (const key in form) {
                if ((key === "archivo_pdf" || key === "video") && !form[key]) continue;
                data.append(key, form[key]);
            }
            // No agregues perfil aquí

            await axios.put(
                `http://127.0.0.1:8000/api/estudios/funcionales/${id}/`,
                data,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            navigate(`/menu/${perfilId}/estudios/funcional/lista`);
        } catch (error) {
            console.error('Error al actualizar el estudio funcional:', error.response?.data || error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(
                `http://127.0.0.1:8000/api/estudios/funcionales/${id}/?perfil=${perfilId}`,
                {
                    headers: { Authorization: `Token ${token}` },
                }
            );
            navigate(`/menu/${perfilId}/estudios`);
        } catch (error) {
            console.error('Error al eliminar el estudio funcional:', error);
        }
    };

    return (

        <div className="main-layout">
            {/* Navbar */}
            <nav className="custom-navbar d-flex justify-content-between align-items-center px-4 py-2">
                <h4 className="text-light m-0">
                    <i className="bi bi-person-circle me-2"></i>MedPal
                </h4>
                <button onClick={() => alert('Logout pressed')} className="btn btn-outline-light">
                    Logout
                </button>
            </nav>


            <div className="container mt-5">
                <h2 className="mb-4 text-center text-white">Editar o Eliminar Estudio Funcional</h2>
                <div className="card p-4 shadow-sm">
                    <div className="grid-form">
                        <div className="mb-3">
                            <label className="form-label">Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                name="nombre"
                                value={form.nombre}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Fecha</label>
                            <input
                                type="date"
                                className="form-control"
                                name="fecha"
                                value={form.fecha}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Tipo de estudio</label>
                            <input
                                type="text"
                                className="form-control"
                                name="tipo_estudio"
                                value={form.tipo_estudio}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Duración</label>
                            <input
                                type="text"
                                className="form-control"
                                name="duracion"
                                value={form.duracion}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Hallazgos</label>
                            <textarea
                                className="form-control"
                                name="hallazgos"
                                value={form.hallazgos}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">PDF</label>
                            <input
                                type="file"
                                className="form-control"
                                name="archivo_pdf"
                                accept="application/pdf"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Video</label>
                            <input
                                type="file"
                                className="form-control"
                                name="video"
                                accept="video/*"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                name="interpretacion_automatica"
                                checked={form.interpretacion_automatica}
                                onChange={handleChange}
                            />
                            <label className="form-check-label">Interpretación automática</label>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                        <button className="btn btn-success" onClick={handleUpdate}>
                            Guardar Cambios
                        </button>
                        <button className="btn btn-danger" onClick={handleDelete}>
                            Eliminar
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate(`/menu/${perfilId}/estudios`)}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <footer className="custom-footer text-center text-light py-2">
                © 2025 MedPal
            </footer>

        </div>
    );
}