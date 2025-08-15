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

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (

        <div className="main-layout">
            {/* Navbar */}

            <nav className="custom-navbar d-flex justify-content-between align-items-center px-4 py-2">
                <h4 className="text-light m-0">
                    <i className="bi bi-person-circle me-2"></i>MedPal
                </h4>
                <button onClick={handleLogout} className="btn btn-outline-light">Logout</button>
            </nav>
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
                                        <div className="d-flex align-items-center gap-2">
                                            {estudio.archivo_pdf && (
                                                <a href={estudio.archivo_pdf} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
                                                    Ver PDF
                                                </a>
                                            )}
                                            <button
                                                className="btn btn-warning"
                                                onClick={() => navigate(`/menu/${perfilId}/estudios/laboratorio/editar-eliminar/${estudio.id}`)}
                                            >
                                                Editar / Eliminar
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="boton-regresar">
                    <button className="btn btn-secondary" onClick={() => navigate(`/menu/${perfilId}/estudios`)}>
                        ← Volver a Estudios
                    </button>
                </div>
            </div>

            <footer className="custom-footer text-center text-light py-2">
                © 2025 MedPal
            </footer>

        </div>
    );

}