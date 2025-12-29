import "@styles/historial.css";
import useGetHistorial from "@hooks/historial/useGetHistorial";
import { useEffect } from "react";

const Historial = () => {
    const { historial, loading, error, fetchHistorial } = useGetHistorial();
    
    useEffect(() => {
        fetchHistorial();
    }, []);
    
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleString('es-CL', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    };
    
    if (loading) {
        return (
            <div className="historial-page">
                <div className="historial-header">
                    <h2>Historial de bicicletas</h2>
                </div>
                <div className="loading-container">
                    <p>Cargando historial...</p>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="historial-page">
                <div className="historial-header">
                    <h2>Historial de bicicletas</h2>
                </div>
                <div className="error-container">
                    <p className="error-text">Error: {error}</p>
                    <button 
                        onClick={fetchHistorial}
                        className="retry-button"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="historial-page">
            <div className="historial-header">
                <h2>Historial de bicicletas</h2>
            </div>
            
            <table className="historial-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Ingreso</th>
                        <th>Salida</th>
                        <th>Usuario</th>
                        <th>Número de Serie</th>
                        <th>Marca</th>
                        <th>Color</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(historial) && historial.length > 0 ? (
                        historial.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{formatDate(item.fecha_ingreso)}</td>
                                <td>{formatDate(item.fecha_salida)}</td>
                                <td>
                                    {item.usuario?.nombre || 'N/A'} {item.usuario?.apellido || ''}
                                    <br />
                                    <small style={{ color: '#666' }}>
                                        {item.usuario?.rut || item.rut_user || ''}
                                    </small>
                                </td>
                                <td>{item.bicicletas?.numero_serie || 'N/A'}</td>
                                <td>{item.bicicletas?.marca || 'N/A'}</td>
                                <td>{item.bicicletas?.color || 'N/A'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No hay registros de historial</td>
                        </tr>
                    )}
                </tbody>
            </table>
            
            {/* Información de debug (opcional) */}
            {historial.length > 0 && (
                <div style={{ marginTop: '20px', fontSize: '12px', color: '#ffffffff' }}>
                    <p>Mostrando {historial.length} registros</p>
                </div>
            )}
        </div>
    );
};

export default Historial;
