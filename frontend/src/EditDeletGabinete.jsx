import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function EditarEliminarGabinete() {
    const { perfilId, id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [form, setForm] = useState({
        nombre: "",
        fecha_realizacion: "",
        centro_medico: "",
        motivo_clinico: "",
        resultado: "",
        archivo_pdf: null,
        imagenes: null,
        video: null,
        observaciones: "",
    });

    useEffect(() => {
        if (!token) {
            navigate('/signin');
            return;
        }

        const fetchGabinete = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/estudios/gabinete/${id}/?perfil=${perfilId}`,
                    {
                        headers: { Authorization: `Token ${token}` }
                    }
                );
                setForm(response.data);
            } catch (error) {
                console.error('Error al obtener el estudio de gabinete:', error);
            }
        };

        if (id) {
            fetchGabinete();
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
                // Solo agrega archivos si hay uno nuevo
                if ((key === "archivo_pdf" || key === "imagenes" || key === "video") && !form[key]) continue;
                data.append(key, form[key]);
            }
            // No agregues perfil aquí

            await axios.put(
                `http://127.0.0.1:8000/api/estudios/gabinete/${id}/`,
                data,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            navigate(`/menu/${perfilId}/estudios/gabinete/lista`);
        } catch (error) {
            console.error('Error al actualizar el estudio de gabinete:', error.response?.data || error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(
                `http://127.0.0.1:8000/api/estudios/gabinete/${id}/?perfil=${perfilId}`,
                {
                    headers: { Authorization: `Token ${token}` },
                }
            );
            navigate(`/menu/${perfilId}/estudios`);
        } catch (error) {
            console.error('Error al eliminar el estudio de gabinete:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Editar o Eliminar Estudio de Gabinete</h2>
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
                    <label className="form-label">Fecha de realización</label>
                    <input
                        type="date"
                        className="form-control"
                        name="fecha_realizacion"
                        value={form.fecha_realizacion}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Centro médico</label>
                    <input
                        type="text"
                        className="form-control"
                        name="centro_medico"
                        value={form.centro_medico}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Motivo clínico</label>
                    <textarea
                        className="form-control"
                        name="motivo_clinico"
                        value={form.motivo_clinico}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Resultado</label>
                    <textarea
                        className="form-control"
                        name="resultado"
                        value={form.resultado}
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
                    <label className="form-label">Imagen</label>
                    <input
                        type="file"
                        className="form-control"
                        name="imagenes"
                        accept="image/*"
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

                <div className="mb-3">
                    <label className="form-label">Observaciones</label>
                    <textarea
                        className="form-control"
                        name="observaciones"
                        value={form.observaciones}
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