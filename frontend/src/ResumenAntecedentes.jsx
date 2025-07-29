import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ResumenAntecedentes.css'; // tu propio estilo si quieres

export default function AntecedentesMedicos() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [datos, setDatos] = useState({
        personalesPatologicos: null,
        personalesNoPatologicos: null,
        heredoFamiliares: null,
        Alergias: null,
        Intolerancias: null
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = { Authorization: `Bearer ${token}` };

                const [
                    patologicos,
                    noPatologicos,
                    heredo,
                    alergias,
                    intolerancias
                ] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/antecedentesMedicos/personalesPatologicos/', { headers }),
                    axios.get('http://127.0.0.1:8000/antecedentesMedicos/personalesNoPatologicos/', { headers }),
                    axios.get('http://127.0.0.1:8000/antecedentesMedicos/heredoFamiliares/', { headers }),
                    axios.get('http://127.0.0.1:8000/antecedentesMedicos/alergias/', { headers }),
                    axios.get('http://127.0.0.1:8000/antecedentesMedicos/intolerancias/', { headers }),
                ]);

                setDatos({
                    personalesPatologicos: patologicos.data[0] || null,
                    personalesNoPatologicos: noPatologicos.data[0] || null,
                    heredoFamiliares: heredo.data[0] || null,
                    Alergias: alergias.data[0] || null,
                    Intolerancias: intolerancias.data[0] || null
                });
            } catch (error) {
                console.error('Error al cargar antecedentes:', error);
            }
        };

        fetchData();
    }, [token]);

    const renderCard = (titulo, data, ruta) => (
        <div className="card mb-4 shadow-sm">
            {/* Navbar fijo arriba */}
            <div className="custom-navbar">
                <h5 className="mb-0">MedPal</h5>

            </div>
            <div className="card-body">
                <h5 className="card-title">{titulo}</h5>
                {data ? (
                    <>
                        <pre className="card-text small bg-light p-2 rounded">{JSON.stringify(data, null, 2)}</pre>
                        <button
                            className="btn btn-warning mt-2"
                            onClick={() => navigate(`/${ruta}/editar/${data.id}`)}
                        >
                            Editar
                        </button>
                    </>
                ) : (
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/${ruta}/crear`)}
                    >
                        Agregar
                    </button>
                )}
            </div>
            
            {/* Footer fijo abajo */}
            <div className="custom-footer">
                &copy; 2025 MedPal - Todos los derechos reservados
            </div>
        </div>
    );

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Antecedentes Médicos</h2>

            {renderCard("Antecedentes Personales Patológicos", datos.personalesPatologicos, "personalesPatologicos")}
            {renderCard("Antecedentes Personales No Patológicos", datos.personalesNoPatologicos, "personalesNoPatologicos")}
            {renderCard("Antecedentes Heredofamiliares", datos.heredoFamiliares, "heredoFamiliares")}
            {renderCard("Alergias", datos.Alergias, "Alergias")}
            {renderCard("Intolerancias", datos.Intolerancias, "Intolerancias")}
        </div>
    );
}
