import { useMemo } from 'react';

export const useEstadisticasReclamos = (reclamos) => {
  const estadisticas = useMemo(() => {
    const total = reclamos.length;
    const pendientes = reclamos.filter(r => r.estado === 'pendiente').length;
    const contestados = reclamos.filter(r => r.estado === 'contestado').length;
    const resueltos = reclamos.filter(r => r.estado === 'resuelto').length;
    const cerrados = reclamos.filter(r => r.estado === 'cerrado').length;
    
    return { total, pendientes, contestados, resueltos, cerrados };
  }, [reclamos]);

  return estadisticas;
};

// Componente EstadisticasReclamos
export const EstadisticasReclamos = ({ estadisticas, puedeVerTodos }) => {
  if (!puedeVerTodos) return null;

  return (
    <div className="estadisticas-reclamos">
      <div className="estadistica-item">
        <span className="estadistica-numero">{estadisticas.total}</span>
        <span className="estadistica-label">Total</span>
      </div>
      <div className="estadistica-item">
        <span className="estadistica-numero" style={{color: '#ff9800'}}>{estadisticas.pendientes}</span>
        <span className="estadistica-label">Pendientes</span>
      </div>
      <div className="estadistica-item">
        <span className="estadistica-numero" style={{color: '#2196f3'}}>{estadisticas.contestados}</span>
        <span className="estadistica-label">Contestados</span>
      </div>
      <div className="estadistica-item">
        <span className="estadistica-numero" style={{color: '#4caf50'}}>{estadisticas.resueltos}</span>
        <span className="estadistica-label">Resueltos</span>
      </div>
    </div>
  );
};

export default useEstadisticasReclamos;