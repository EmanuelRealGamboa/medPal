import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function VaccinesList() {
    const { perfilId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [vaccines, setVaccines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate('/signin');
            return;
        }
        const fetchVaccines = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/vaccines/records/?perfil=${perfilId}`,
                    { headers: { Authorization: `Token ${token}` } }
                );
                setVaccines(response.data);
            } catch (error) {
                console.error("Error al cargar registros de vacunas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVaccines();
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
            <div className="container" style={{ marginTop: "220px" }}>
                <h2 className="mb-4 text-center text-white">Vacunas Registradas</h2>

                <div className="text-center mb-4">
                    <button
                        className="btn btn-success me-2"
                        onClick={() => navigate(`/menu/${perfilId}/vacunas/agregar`)}
                    >
                        + Agregar nueva vacuna
                    </button>
                </div>



                {vaccines.length === 0 ? (
                    <div className="alert alert-info text-center">
                        No hay vacunas registradas.
                    </div>
                ) : (
                    <div className="row">
                        {vaccines.map(vaccine => (
                            <div className="col-md-6 mb-4" key={vaccine.id}>
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">{vaccine.vaccine_type_name || "Vacuna sin nombre"}</h5>
                                        <p><strong>Dosis:</strong> {vaccine.dose_number}</p>
                                        <p><strong>Estado:</strong> {vaccine.status}</p>
                                        {vaccine.scheduled_date && (
                                            <p><strong>Fecha programada:</strong> {vaccine.scheduled_date}</p>
                                        )}
                                        {vaccine.applied_date && (
                                            <p><strong>Fecha aplicada:</strong> {vaccine.applied_date}</p>
                                        )}
                                        {vaccine.healthcare_provider && (
                                            <p><strong>Proveedor:</strong> {vaccine.healthcare_provider}</p>
                                        )}
                                        {vaccine.doctor_name && (
                                            <p><strong>Médico:</strong> {vaccine.doctor_name}</p>
                                        )}
                                        {vaccine.batch_number && (
                                            <p><strong>Lote:</strong> {vaccine.batch_number}</p>
                                        )}
                                        {vaccine.reaction && (
                                            <p><strong>Reacción:</strong> {vaccine.reaction}</p>
                                        )}
                                        {vaccine.notes && (
                                            <p><strong>Notas:</strong> {vaccine.notes}</p>
                                        )}

                                        <button
                                            className="btn btn-warning mt-2"
                                            onClick={() =>
                                                navigate(`/menu/${perfilId}/vacunas/editar-eliminar/${vaccine.id}`)
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
                <div className="boton-regresar mt-4">
                    <button className="btn btn-secondary" onClick={() => navigate(`/menu/${perfilId}`)}>
                        ← Volver al Menú
                    </button>
                </div>
            </div>
            <footer className="custom-footer text-center text-light py-2">
                © 2025 MedPal
            </footer>
        </div>
    );
}
