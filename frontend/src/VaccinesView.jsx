import React, { useState, useEffect } from 'react';
// ❌ Elimina este import, ya no se usará
// import VaccineForm from './VaccinesForm';

import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // ✅ Usa navigate
import './VaccinesView.css';

export default function VaccineList() {
    const [vaccineRecords, setVaccineRecords] = useState([]);
    const [vaccineTypes, setVaccineTypes] = useState([]);
    const [vaccineAlerts, setVaccineAlerts] = useState([]);
    const [editingRecord, setEditingRecord] = useState(null);

    const { id: perfilId } = useParams();
    const navigate = useNavigate(); // ✅ para redirigir
    const token = localStorage.getItem('token');

    const headers = {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
    };

    const fetchData = async () => {
        try {
            const [recordsRes, typesRes, alertsRes] = await Promise.all([
                axios.get('http://127.0.0.1:8000/vacunas/registros/', { headers }),
                axios.get('http://127.0.0.1:8000/vacunas/tipos/', { headers }),
                axios.get('http://127.0.0.1:8000/vacunas/alertas/', { headers }),
            ]);
            setVaccineRecords(recordsRes.data);
            setVaccineTypes(typesRes.data);
            setVaccineAlerts(alertsRes.data);
        } catch (error) {
            console.error('Error al cargar los datos:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este registro?')) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/vacunas/registros/${id}/`, { headers });
            fetchData();
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    };

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
                <h3 className="text-center mb-4">Registros de Vacunas</h3>

                <div className="d-flex justify-content-end mb-3">
                    <button
                        onClick={() => navigate(`/menu/${perfilId}/vacunas/agregar`)} // ✅ Redirige a formulario
                        className="btn btn-success"
                    >
                        + Agregar Vacuna
                    </button>
                </div>

                {/* Tabla de registros */}
                <div className="table-responsive mb-5">
                    <table className="table table-bordered">
                        <thead className="table-light">
                            <tr>
                                <th>Usuario</th>
                                <th>Vacuna</th>
                                <th>Dosis</th>
                                <th>Estado</th>
                                <th>Fecha Programada</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vaccineRecords.map((record) => (
                                <tr key={record.id}>
                                    <td>{record.user}</td>
                                    <td>{record.vaccine_type_name || record.vaccine_type}</td>
                                    <td>{record.dose_number}</td>
                                    <td>{record.status}</td>
                                    <td>{record.scheduled_date}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => {
                                                // Aquí podrías redirigir a editar
                                                navigate(`/menu/${perfilId}/vacunas/editar/${record.id}`);
                                            }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(record.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Tabla de alertas */}
                <div>
                    <h4 className="mb-3">Alertas de Vacunas</h4>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>Usuario</th>
                                    <th>Tipo</th>
                                    <th>Prioridad</th>
                                    <th>Mensaje</th>
                                    <th>Fecha de Alerta</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vaccineAlerts.map((alert) => (
                                    <tr key={alert.id}>
                                        <td>{alert.user}</td>
                                        <td>{alert.alert_type}</td>
                                        <td>{alert.priority}</td>
                                        <td>{alert.message}</td>
                                        <td>{new Date(alert.alert_date).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
