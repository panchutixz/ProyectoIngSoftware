import { useState, useCallback } from "react";

export function useFiltrosReclamos(initialFilters = {}) {
  const [filtros, setFiltros] = useState({
    estado: "",
    fecha_desde: "",
    fecha_hasta: "",
    numero_serie: "",
    rut_usuario: "",
    ...initialFilters
  });
  
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const actualizarFiltro = useCallback((nombre, valor) => {
    setFiltros(prev => ({
      ...prev,
      [nombre]: valor
    }));
  }, []);

  const limpiarFiltros = useCallback(() => {
    setFiltros({
      estado: "",
      fecha_desde: "",
      fecha_hasta: "",
      numero_serie: "",
      rut_usuario: "",
      ...initialFilters
    });
  }, [initialFilters]);

  const toggleFiltros = useCallback(() => {
    setMostrarFiltros(prev => !prev);
  }, []);

  const tieneFiltrosActivos = useCallback(() => {
    return Object.values(filtros).some(valor => 
      valor !== null && valor !== undefined && valor !== ''
    );
  }, [filtros]);

  return {
    filtros,
    mostrarFiltros,
    actualizarFiltro,
    limpiarFiltros,
    toggleFiltros,
    tieneFiltrosActivos,
    setFiltros,
    setMostrarFiltros
  };
}

// Componente PanelFiltros
export const PanelFiltros = ({ 
  filtros, 
  actualizarFiltro, 
  aplicarFiltros, 
  limpiarFiltros, 
  puedeFiltrarRUT, 
  loadingReclamos, 
  tieneFiltrosActivos 
}) => (
  <div className="panel-filtros">
    <h3>Filtrar Reclamos</h3>
    
    <div className="filtros-grid">
      <div className="filtro-grupo">
        <label>Estado:</label>
        <select 
          value={filtros.estado}
          onChange={(e) => actualizarFiltro('estado', e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="contestado">Contestado</option>
          <option value="resuelto">Resuelto</option>
          <option value="cerrado">Cerrado</option>
        </select>
      </div>

      <div className="filtro-grupo">
        <label>Fecha desde:</label>
        <input 
          type="date" 
          value={filtros.fecha_desde}
          onChange={(e) => actualizarFiltro('fecha_desde', e.target.value)}
        />
      </div>

      <div className="filtro-grupo">
        <label>Fecha hasta:</label>
        <input 
          type="date" 
          value={filtros.fecha_hasta}
          onChange={(e) => actualizarFiltro('fecha_hasta', e.target.value)}
        />
      </div>

      <div className="filtro-grupo">
        <label>Número de serie:</label>
        <input 
          type="text" 
          placeholder="Ej: ABC123"
          value={filtros.numero_serie}
          onChange={(e) => actualizarFiltro('numero_serie', e.target.value)}
        />
      </div>

      {puedeFiltrarRUT && (
        <div className="filtro-grupo">
          <label>RUT usuario:</label>
          <input 
            type="text" 
            placeholder="Ej: 12.345.678-9"
            value={filtros.rut_usuario}
            onChange={(e) => actualizarFiltro('rut_usuario', e.target.value)}
          />
        </div>
      )}
    </div>

    <div className="filtros-acciones">
      <button 
        className="btn-aplicar-filtros"
        onClick={aplicarFiltros}
        disabled={loadingReclamos}
      >
        <i className="fas fa-search"></i> Aplicar Filtros
      </button>
      
      <button 
        className="btn-limpiar-filtros"
        onClick={limpiarFiltros}
        disabled={loadingReclamos || !tieneFiltrosActivos}
      >
        <i className="fas fa-times"></i> Limpiar Filtros
      </button>
    </div>
  </div>
);

export default useFiltrosReclamos;