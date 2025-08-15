import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function EditarEliminarLaboratorio() {
    const { perfilId, id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [form, setForm] = useState({
        nombre: "",
        fecha_muestra: "",
        laboratorio: "",
        tecnica: "",
        valores: "",
        archivo_pdf: null,
        accion_medica: "",
    });

    useEffect(() => {
        if (!token) {
            navigate('/signin');
            return;
        }

        const fetchLaboratorio = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/estudios/laboratorio/${id}/?perfil=${perfilId}`,
                    {
                        headers: { Authorization: `Token ${token}` }
                    }
                );
                setForm(response.data);
            } catch (error) {
                console.error('Error al obtener el estudio de laboratorio:', error);
            }
        };

        if (id) {
            fetchLaboratorio();
        }
    }, [id, navigate, perfilId, token]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({ ...form, [name]: files ? files[0] : value });
    };

    const handleUpdate = async () => {
        try {
            const data = new FormData();
            for (const key in form) {
                if (key === "archivo_pdf") {
                    if (form[key]) {
                        data.append(key, form[key]); // Solo si hay archivo nuevo
                    }
                } else {
                    data.append(key, form[key]);
                }
            }
            // No agregues perfil aquí

            await axios.put(
                `http://127.0.0.1:8000/api/estudios/laboratorio/${id}/?perfil=${perfilId}`,
                data,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            navigate(`/menu/${perfilId}/estudios/laboratorio/lista`);
        } catch (error) {
            console.error('Error al actualizar el estudio de laboratorio:', error.response?.data || error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(
                `http://127.0.0.1:8000/api/estudios/laboratorio/${id}/?perfil=${perfilId}`,
                {
                    headers: { Authorization: `Token ${token}` },
                }
            );
            navigate(`/menu/${perfilId}/estudios`);
        } catch (error) {
            console.error('Error al eliminar el estudio de laboratorio:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Editar o Eliminar Estudio de Laboratorio</h2>
            <div className="card p-4 shadow-sm">
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
                    <label className="form-label">Fecha de muestra</label>
                    <input
                        type="date"
                        className="form-control"
                        name="fecha_muestra"
                        value={form.fecha_muestra}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Laboratorio</label>
                    <input
                        type="text"
                        className="form-control"
                        name="laboratorio"
                        value={form.laboratorio}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Técnica</label>
                    <textarea
                        className="form-control"
                        name="tecnica"
                        value={form.tecnica}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Valores</label>
                    <textarea
                        className="form-control"
                        name="valores"
                        value={form.valores}
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
                    <label className="form-label">Acción médica</label>
                    <textarea
                        className="form-control"
                        name="accion_medica"
                        value={form.accion_medica}
                        onChange={handleChange}
                    />
                </div>

                <div className="d-flex justify-content-between">
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
    );
}