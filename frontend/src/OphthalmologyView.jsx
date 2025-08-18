import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './OphthalmologyView.css';

export default function OphthalmologyView() {
    const navigate = useNavigate();
    const { perfilId } = useParams();
    const token = localStorage.getItem('token');
    const [diagnostico, setDiagnostico] = useState(null);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(
                    'http://127.0.0.1:8000/ophthalmology/diagnoses/',
                    {
                        params: { perfil: perfilId },
                        headers: { Authorization: `Token ${token}` }
                    }
                );

                if (response.data.length > 0) {
                    // Si hay varios, podrías listarlos, pero aquí tomamos el primero
                    setDiagnostico(response.data[0]);
                } else {
                    setDiagnostico(null);
                    setMensaje('No se encontraron diagnósticos registrados.');
                }
            } catch (error) {
                console.error(error);
                setDiagnostico(null);
                setMensaje('Error al obtener el diagnóstico.');
            }
        }

        if (perfilId) {
            fetchData();
        }
    }, [perfilId, token]);

    return (
        <div className="perfil-bg">
            <div className="custom-navbar">
                <h5 className="mb-0">MedPal</h5>
                <span>Diagnóstico oftalmológico</span>
            </div>

            <div className="main-layout p-4">
                <h3 className="mb-4 text-center">Diagnóstico oftalmológico</h3>

                {diagnostico ? (
                    <>
                        <div className="perfil-wrapper">
                            <p><strong>Diagnóstico:</strong> {diagnostico.diagnosis}</p>
                            <p><strong>Fecha:</strong> {diagnostico.exam_date}</p>
                            <p><strong>Paciente:</strong> {diagnostico.patient_name}</p>
                        </div>

                        <div className="d-flex gap-3 justify-content-center mt-4">
                            {/* Editar → redirige a la ruta con diagnosticoId */}
                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    navigate(`/menu/${perfilId}/oftalmologia/editar/${diagnostico.id}`)
                                }
                            >
                                Editar
                            </button>

                            {/* Eliminar diagnóstico */}
                            <button
                                className="btn btn-danger"
                                onClick={async () => {
                                    if (!window.confirm("¿Seguro que deseas eliminar este diagnóstico?")) return;
                                    try {
                                        await axios.delete(
                                            `http://127.0.0.1:8000/ophthalmology/diagnoses/${diagnostico.id}/`,
                                            { headers: { Authorization: `Token ${token}` } }
                                        );
                                        alert("Diagnóstico eliminado correctamente");
                                        setDiagnostico(null);
                                        setMensaje("Diagnóstico eliminado");
                                    } catch (error) {
                                        console.error(error);
                                        alert("Error al eliminar diagnóstico");
                                    }
                                }}
                            >
                                Eliminar
                            </button>

                            {/* Ver detalle */}
                            <button
  className="btn btn-secondary"
  onClick={() =>
    navigate(`/menu/${perfilId}/oftalmologia/detalle/${diagnostico.id}`)
  }
>
  Ver detalle
</button>

                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-muted text-center">{mensaje || 'No hay diagnóstico registrado.'}</p>
                        <div className="d-flex justify-content-center">
                            <button
                                className="btn btn-success"
                                onClick={() => navigate(`/menu/${perfilId}/oftalmologia/agregar`)}
                            >
                                Agregar
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div className="custom-footer">
                &copy; 2025 MedPal - Todos los derechos reservados
            </div>
        </div>
    );
}