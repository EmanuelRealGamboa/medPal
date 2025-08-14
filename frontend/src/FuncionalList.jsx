import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function FuncionalList() {
    const { perfilId } = useParams(); // ← Obtiene el perfilId de la URL
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [estudios, setEstudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/signin');
            return;
        }
        const fetchFuncionales = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/estudios/funcionales/?perfil=${perfilId}`,
                    { headers: { Authorization: `Token ${token}` } }
                );
                setEstudios(response.data);
            } catch (error) {
                setError("No se pudieron cargar los estudios funcionales.");
                console.error("Error al cargar estudios funcionales:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFuncionales();
    }, [perfilId, token, navigate]);

    if (!token) return null;
    if (loading) return <div className="text-center mt-5">Cargando...</div>;
    if (error) return <div className="alert alert-danger text-center">{error}</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Estudios Funcionales Realizados</h2>
            <div className="text-center mb-4">
                <button
                    className="btn btn-success"
                    onClick={() => navigate(`/menu/${perfilId}/estudios/funcional`)}
                >
                    + Agregar nuevo estudio
                </button>
            </div>
            {estudios.length === 0 ? (
                <div className="alert alert-info text-center">
                    No hay estudios funcionales registrados.
                </div>
            ) : (
                <div className="row">
                    {estudios.map(estudio => (
                        <div className="col-md-6 mb-4" key={estudio.id}>
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{estudio.nombre}</h5>
                                    <p><strong>Fecha:</strong> {estudio.fecha}</p>
                                    <p><strong>Tipo de estudio:</strong> {estudio.tipo_estudio}</p>
                                    <p><strong>Duración:</strong> {estudio.duracion}</p>
                                    <p><strong>Hallazgos:</strong> {estudio.hallazgos}</p>
                                    <p><strong>Interpretación automática:</strong> {estudio.interpretacion_automatica ? "Sí" : "No"}</p>
                                    {estudio.archivo_pdf && (
                                        <a
                                            href={estudio.archivo_pdf}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-outline-primary btn-sm mb-2"
                                        >
                                            Ver PDF
                                        </a>
                                    )}
                                    {estudio.video && (
                                        <a
                                            href={estudio.video}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-outline-secondary btn-sm mb-2"
                                        >
                                            Ver Video
                                        </a>
                                    )}
                                    <button
                                        className="btn btn-warning mt-2"
                                        onClick={() =>
                                            navigate(`/menu/${perfilId}/estudios/funcional/editar-eliminar/${estudio.id}`)
                                        }
                                    >
                                        Editar / Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="text-center mt-4">
                <button className="btn btn-secondary" onClick={() => navigate(`/menu/${perfilId}/estudios`)}>
                    ← Volver a Estudios
                </button>
            </div>

        </div>
    );
}