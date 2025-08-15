import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './AlertasView.css'; // Estilos personalizados

const AlertsView = () => {
    const { perfilId } = useParams(); // Extrae perfilId de la URL
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await axios.get(`/api/alerts/?perfilId=${perfilId}`);
                setAlerts(response.data);
            } catch (error) {
                console.error('Error al cargar alertas:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, [perfilId]);

    const markAsRead = async (alertId) => {
        try {
            await axios.post(`/api/alerts/${alertId}/mark-read/`);
            setAlerts(prev =>
                prev.map(alert =>
                    alert.id === alertId ? { ...alert, is_read: true } : alert
                )
            );
        } catch (error) {
            console.error('Error al marcar como leída:', error);
        }
    };

    if (loading) return <p>Cargando alertas...</p>;

    return (
        <div className="alerts-container">
            <h2>🔔 Alertas de Vacunas</h2>
            {alerts.length === 0 ? (
                <p>No hay alertas disponibles.</p>
            ) : (
                alerts.map(alert => (
                    <div key={alert.id} className={`alert-card ${alert.priority}`}>
                        <h4>{alert.vaccine_record?.vaccine_type?.name || 'Recordatorio general'}</h4>
                        <p><strong>Tipo:</strong> {alert.alert_type}</p>
                        <p><strong>Prioridad:</strong> {alert.priority}</p>
                        <p><strong>Mensaje:</strong> {alert.message}</p>
                        <p><strong>Fecha:</strong> {new Date(alert.alert_date).toLocaleString()}</p>
                        {!alert.is_read && (
                            <button onClick={() => markAsRead(alert.id)}>Marcar como leída</button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default AlertsView;