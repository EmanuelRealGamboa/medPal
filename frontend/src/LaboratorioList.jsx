import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function LaboratorioList() {
    const { perfilId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [estudios, setEstudios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate('/signin');
            return;
        }
        const fetchLaboratorios = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/estudios/laboratorio/?perfil=${perfilId}`,
                    { headers: { Authorization: `Token ${token}` } }
                );
                setEstudios(response.data);
            } catch (error) {
                console.error("Error al cargar estudios de laboratorio:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLaboratorios();
    }, [perfilId, token, navigate]);

    if (loading) return <div className="text-center mt-5">Cargando...</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center text-white">Estudios de Laboratorio Realizados</h2>
            <div className="text-center mb-4">
                <button
                    className="btn btn-success"
                    onClick={() => navigate(`/menu/${perfilId}/estudios/laboratorio`)}
                >
                    + Agregar nuevo estudio
                </button>
            </div>
            {estudios.length === 0 ? (
                <div className="alert alert-info text-center">
                    No hay estudios de laboratorio registrados.
                </div>
            ) : (
                <div className="row">
                    {estudios.map(estudio => (
                        <div className="col-md-6 mb-4" key={estudio.id}>
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{estudio.nombre}</h5>
                                    <p><strong>Fecha de muestra:</strong> {estudio.fecha_muestra}</p>
                                    <p><strong>Laboratorio:</strong> {estudio.laboratorio}</p>
                                    <p><strong>Técnica:</strong> {estudio.tecnica}</p>
                                    <p><strong>Valores:</strong> {estudio.valores}</p>
                                    <p><strong>Acción médica:</strong> {estudio.accion_medica}</p>
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
                                    <button
                                        className="btn btn-warning mt-2"
                                        onClick={() =>
                                            navigate(`/menu/${perfilId}/estudios/laboratorio/editar-eliminar/${estudio.id}`)
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