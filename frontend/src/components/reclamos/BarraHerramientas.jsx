
export const BarraHerramientas = ({
  permisos,
  mostrarFormulario,
  mostrarFiltros,
  tieneFiltrosActivos,
  hasBicicletasPermitidas,
  cargandoBicicletas,
  onAbrirFormulario,
  onToggleFiltros,
  onRefresh,
  loadingReclamos
}) => (
  <div className="herramientas-reclamos">
    <div className="herramientas-izquierda">
      <button 
        className="btn-filtros"
        onClick={onToggleFiltros}
      >
        <i className={`fas ${mostrarFiltros ? 'fa-filter-circle-xmark' : 'fa-filter'}`}></i>
        {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        {tieneFiltrosActivos && <span className="filtro-activo-indicador">●</span>}
      </button>

      {permisos.puedeCrearReclamo && !mostrarFormulario && (
        <button 
          className="reclamos-addbtn"
          onClick={onAbrirFormulario}
          disabled={!hasBicicletasPermitidas || cargandoBicicletas}
          title={!hasBicicletasPermitidas ? "Necesitas una bicicleta en estado 'entregada' o 'olvidada'" : ""}
        >
          <i className="fas fa-plus"></i> Crear Nuevo Reclamo
        </button>
      )}
    </div>

    <div className="herramientas-derecha">
      <button 
        className="refresh-btn"
        onClick={onRefresh}
        disabled={loadingReclamos}
        title="Actualizar lista"
      >
        <i className="fas fa-sync-alt"></i>
        {loadingReclamos ? " Actualizando..." : " Actualizar"}
      </button>
    </div>
  </div>
);

