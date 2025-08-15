import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function EditarEliminarVacuna() {
    const { perfilId, id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [form, setForm] = useState({
        vaccine_type: '',
        dose_number: 1,
        status: 'scheduled',
        scheduled_date: '',
        applied_date: '',
        healthcare_provider: '',
        doctor_name: '',
        batch_number: '',
        reaction: 'none',
        reaction_notes: '',
        notes: ''
    });

    const [vaccineTypes, setVaccineTypes] = useState([]);

    useEffect(() => {
        if (!token) {
            navigate('/signin');
            return;
        }

        const fetchVaccineTypes = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/vaccines/types/', {
                    headers: { Authorization: `Token ${token}` }
                });
                setVaccineTypes(res.data);
            } catch (error) {
                console.error('Error al obtener tipos de vacuna:', error);
            }
        };

        const fetchVacuna = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/vaccines/records/${id}/`,
                    { headers: { Authorization: `Token ${token}` } }
                );

                const vacuna = response.data;

                setForm({
                    vaccine_type: vacuna.vaccine_type || '',
                    dose_number: vacuna.dose_number || 1,
                    status: vacuna.status || 'scheduled',
                    scheduled_date: vacuna.scheduled_date || '',
                    applied_date: vacuna.applied_date || '',
                    healthcare_provider: vacuna.healthcare_provider || '',
                    doctor_name: vacuna.doctor_name || '',
                    batch_number: vacuna.batch_number || '',
                    reaction: vacuna.reaction || 'none',
                    reaction_notes: vacuna.reaction_notes || '',
                    notes: vacuna.notes || ''
                });
            } catch (error) {
                console.error('Error al obtener la vacuna:', error);
            }
        };

        fetchVaccineTypes();
        if (id) fetchVacuna();
    }, [id, perfilId, navigate, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        const payload = {
            ...form,
           
            vaccine_type: parseInt(form.vaccine_type) || null,
            dose_number: Number(form.dose_number),
            status: String(form.status).trim()
        };

        const isValid =
            payload.vaccine_type &&
            payload.dose_number > 0 &&
            ['scheduled', 'applied', 'cancelled'].includes(payload.status);

        if (!isValid) {
            alert("Por favor completa todos los campos obligatorios correctamente.");
            return;
        }

        try {
            await axios.put(
                `http://127.0.0.1:8000/vaccines/records/${id}/`,
                payload,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            navigate(`/menu/${perfilId}/vacunas/lista`);
        } catch (error) {
            console.error('Error al actualizar la vacuna:', error.response?.data || error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(
                `http://127.0.0.1:8000/vaccines/records/${id}/`,
                { headers: { Authorization: `Token ${token}` } }
            );
            navigate(`/menu/${perfilId}/vacunas/lista`);
        } catch (error) {
            console.error('Error al eliminar la vacuna:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Editar o Eliminar Vacuna</h2>
            <div className="card p-4 shadow-sm">

                <div className="mb-3">
                    <label className="form-label">Tipo de vacuna</label>
                    <select
                        className="form-control"
                        name="vaccine_type"
                        value={form.vaccine_type}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione un tipo de vacuna</option>
                        {vaccineTypes.map(v => (
                            <option key={v.id} value={v.id}>
                                {v.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Número de dosis</label>
                    <input
                        type="number"
                        className="form-control"
                        name="dose_number"
                        value={form.dose_number}
                        onChange={handleChange}
                        min="1"
                        max="10"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <select
                        className="form-control"
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option value="scheduled">Programada</option>
                        <option value="applied">Aplicada</option>
                        <option value="cancelled">Cancelada</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Fecha programada</label>
                    <input
                        type="date"
                        className="form-control"
                        name="scheduled_date"
                        value={form.scheduled_date || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Fecha aplicada</label>
                    <input
                        type="date"
                        className="form-control"
                        name="applied_date"
                        value={form.applied_date || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Proveedor de salud</label>
                    <input
                        type="text"
                        className="form-control"
                        name="healthcare_provider"
                        value={form.healthcare_provider}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Nombre del médico</label>
                    <input
                        type="text"
                        className="form-control"
                        name="doctor_name"
                        value={form.doctor_name}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Número de lote</label>
                    <input
                        type="text"
                        className="form-control"
                        name="batch_number"
                        value={form.batch_number}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Reacción</label>
                    <select
                        className="form-control"
                        name="reaction"
                        value={form.reaction}
                        onChange={handleChange}
                    >
                        <option value="none">Ninguna</option>
                        <option value="mild">Leve</option>
                        <option value="moderate">Moderada</option>
                        <option value="severe">Severa</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Notas sobre reacciones</label>
                    <textarea
                        className="form-control"
                        name="reaction_notes"
                        value={form.reaction_notes}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Observaciones generales</label>
                    <textarea
                        className="form-control"
                        name="notes"
                        value={form.notes}
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
                        onClick={() => navigate(`/menu/${perfilId}/vacunas/lista`)}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
