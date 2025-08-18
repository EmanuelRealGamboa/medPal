import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './VaccinesView.css';

export default function VaccinesView() {
    const [vaccineAlerts, setVaccineAlerts] = useState([]);
    const { perfilId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/signin');
            return;
        }

        const headers = {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        };

        const fetchAlerts = async () => {
            try {
                const alertsRes = await axios.get('http://127.0.0.1:8000/vacunas/alertas/', { headers });
                setVaccineAlerts(alertsRes.data);
            } catch (error) {
                console.error('Error al cargar las alertas:', error);
            }
        };

        fetchAlerts();
    }, [perfilId, navigate, token]);

    return (
        <div className="perfil-bg">
            {/* Navbar */}
            <nav className="custom-navbar d-flex justify-content-between align-items-center px-4 py-2">
                <h4 className="text-light m-0">
                    <i className="bi bi-person-circle me-2"></i>MedPal
                </h4>
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/signin';
                    }}
                    className="btn btn-outline-light"
                >
                    Logout
                </button>
            </nav>

            {/* Contenido principal */}
            <div className="main-layout p-4">
                <h3 className="text-center mb-4">Alertas de Vacunas</h3>

                {vaccineAlerts.length === 0 ? (
                    <div className="alert alert-info text-center">
                       Vacuna Agregada con Éxito
                    </div>
                ) : (
                    <div className="row">
                        {vaccineAlerts.map((alert) => (
                            <div className="col-md-6 mb-4" key={alert.id}>
                                <div className={`card h-100 shadow-sm border-${alert.priority === 'urgent' ? 'danger' : alert.priority === 'high' ? 'warning' : 'secondary'}`}>
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {alert.vaccine_name || 'Vacuna desconocida'}
                                        </h5>
                                        <p><strong>Tipo de alerta:</strong> {alert.alert_type}</p>
                                        <p><strong>Prioridad:</strong> {alert.priority}</p>
                                        <p><strong>Mensaje:</strong> {alert.message}</p>
                                        <p><strong>Fecha de alerta:</strong> {new Date(alert.alert_date).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="custom-footer text-center text-light py-2">
                © 2025 MedPal
            </footer>
        </div>
    );
}