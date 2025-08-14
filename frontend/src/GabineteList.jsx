import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function GabineteList() {
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
        const fetchGabinetes = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/estudios/gabinete/?perfil=${perfilId}`,
                    { headers: { Authorization: `Token ${token}` } }
                );
                setEstudios(response.data);
            } catch (error) {
                setError("No se pudieron cargar los estudios de gabinete.");
                console.error("Error al cargar estudios de gabinete:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGabinetes();
    }, [perfilId, token, navigate]);

    if (!token) return null;
    if (loading) return <div className="text-center mt-5">Cargando...</div>;
    if (error) return <div className="alert alert-danger text-center">{error}</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Estudios de Gabinete Realizados</h2>
            <div className="text-center mb-4">
                <button
                    className="btn btn-success"
                    onClick={() => navigate(`/menu/${perfilId}/estudios/gabinete`)}
                >
                    + Agregar Nuevo Estudio
                </button>
            </div>
            {estudios.length === 0 ? (
                <div className="alert alert-info text-center">
                    No hay estudios de gabinete registrados.
                </div>
            ) : (
                <div className="row">
                    {estudios.map(estudio => (
                        <div className="col-md-6 mb-4" key={estudio.id}>
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{estudio.nombre}</h5>
                                    <p><strong>Fecha de realización:</strong> {estudio.fecha_realizacion}</p>
                                    <p><strong>Centro médico:</strong> {estudio.centro_medico}</p>
                                    <p><strong>Motivo clínico:</strong> {estudio.motivo_clinico}</p>
                                    <p><strong>Resultado:</strong> {estudio.resultado}</p>
                                    <p><strong>Observaciones:</strong> {estudio.observaciones}</p>
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
                                            navigate(`/menu/${perfilId}/estudios/gabinete/editar-eliminar/${estudio.id}`)
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