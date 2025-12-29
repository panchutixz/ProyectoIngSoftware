import "@styles/reclamos.css";
import { useState, useEffect } from "react";
import { useGetReclamos } from "@hooks/reclamos/useGetReclamos";
import { useCreateReclamo } from "@hooks/reclamos/useCreateReclamo";
import { useGetBicicletasUsuario, SelectorBicicletas } from "@hooks/reclamos/useGetBicicletasUsuario";
import { useEditReclamo } from "@hooks/reclamos/useEditReclamo";
import { useDeleteReclamo } from "@hooks/reclamos/useDeleteReclamo";
import { useContestarReclamo } from "@hooks/reclamos/useContestarReclamo";
import { useCambiarEstadoReclamo } from "@hooks/reclamos/useCambiarEstadoReclamo";
import { useFiltrosReclamos, PanelFiltros } from "@hooks/reclamos/useFiltrosReclamos";
import { usePermisosReclamos } from "@hooks/reclamos/usePermisosReclamos";
import { useEstadisticasReclamos, EstadisticasReclamos } from "@hooks/reclamos/useEstadisticasReclamos";
import { BarraHerramientas } from "@components/reclamos/BarraHerramientas";
import { WelcomeMessage } from "@components/reclamos/WelcomeMessage";
import { ReclamoRow } from "@components/reclamos/ReclamoRow";
import { showErrorAlert, showSuccessAlert } from "../helpers/sweetAlert.js";
import Swal from "sweetalert2";

const Reclamos = () => {
  const [descripcion, setDescripcion] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const permisos = usePermisosReclamos();
  const { reclamos, loading: loadingReclamos, error: errorReclamos, fetchReclamos, buscarReclamos } = useGetReclamos();
  const { registrarReclamo, loading: creando, error: errorCrear, success: exitoCrear, resetState: resetCrear } = useCreateReclamo();
  const { bicicletasPermitidas, loading: cargandoBicicletas, fetchBicicletas, hasBicicletasPermitidas } = useGetBicicletasUsuario();
  const { actualizar, loading: actualizando, error: errorActualizar, success: exitoActualizar, resetState: resetActualizar } = useEditReclamo();
  const { eliminar, loading: eliminando, error: errorEliminar, success: exitoEliminar, resetState: resetEliminar } = useDeleteReclamo();
  const { contestar, loading: contestando, error: errorContestar, success: exitoContestar, resetState: resetContestar } = useContestarReclamo();
  const { cambiarEstado, loading: cambiandoEstado, error: errorCambiarEstado, success: exitoCambiarEstado, resetState: resetCambiarEstado } = useCambiarEstadoReclamo();
  const { filtros, mostrarFiltros, actualizarFiltro, limpiarFiltros, toggleFiltros, tieneFiltrosActivos } = useFiltrosReclamos();

  const estadisticas = useEstadisticasReclamos(reclamos);

  useEffect(() => { fetchReclamos(); }, [fetchReclamos]);
  useEffect(() => { if (permisos.puedeCrearReclamo && !cargandoBicicletas) fetchBicicletas(); }, [permisos.puedeCrearReclamo, cargandoBicicletas, fetchBicicletas]);

  const handleAbrirFormulario = () => {
    if (!permisos.puedeCrearReclamo) {
      showErrorAlert("No autorizado", "Solo estudiantes, académicos o funcionarios pueden crear reclamos.");
      return;
    }
    if (!hasBicicletasPermitidas) {
      showErrorAlert("Sin bicicletas válidas", "Solo puedes hacer reclamos de bicicletas en estado 'entregada' o 'olvidada'.");
      return;
    }
    setMostrarFormulario(true);
  };

  const handleCrear = async (e) => {
    e?.preventDefault();
    if (!descripcion.trim() || descripcion.trim().length < 10 || !/[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(descripcion) || !numeroSerie.trim()) {
      showErrorAlert("Validación", "Verifica que la descripción tenga al menos 10 caracteres y contenga letras.");
      return;
    }
    try {
      await registrarReclamo({ descripcion: descripcion.trim(), numero_serie_bicicleta: numeroSerie.trim() });
      setDescripcion(""); setNumeroSerie(""); setMostrarFormulario(false);
      showSuccessAlert("Reclamo creado correctamente");
    } catch (err) { console.error("Error en creación:", err); }
  };

  const handleCancelar = () => { setDescripcion(""); setNumeroSerie(""); setMostrarFormulario(false); };

  const aplicarFiltros = async () => { try { await buscarReclamos(filtros); } catch (err) { console.error("Error al aplicar filtros:", err); } };
  const handleLimpiarFiltros = async () => { limpiarFiltros(); await fetchReclamos(); };

  // Funciones de modales (mantenidas aquí por simplicidad)
  const abrirModalEditar = (reclamo) => { 
    if (reclamo.estado === "contestado") {
    showErrorAlert("Reclamo contestado", "No puedes editar un reclamo que ya ha sido contestado.");
    return;
  }

  // Validar permisos
  if (permisos.puedeCrearReclamo && reclamo.rut_user !== permisos.userRut) {
    showErrorAlert("Sin permiso", "No puedes editar reclamos de otros usuarios");
    return;
  }
  
  Swal.fire({
    title: 'Editar Reclamo',
    html: `
      <textarea id="descripcion-editar" class="swal2-textarea" 
        placeholder="Descripción del reclamo (mínimo 10 caracteres)"
        rows="4">${reclamo.descripcion}</textarea>
      <p class="swal2-validation-message" id="error-mensaje" style="display: none;"></p>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const descripcion = document.getElementById('descripcion-editar').value.trim();
      const errorMensaje = document.getElementById('error-mensaje');
      
      if (!descripcion) {
        errorMensaje.textContent = "La descripción no puede estar vacía";
        errorMensaje.style.display = 'block';
        return false;
      }
      
      if (descripcion.length < 10) {
        errorMensaje.textContent = "La descripción debe tener al menos 10 caracteres";
        errorMensaje.style.display = 'block';
        return false;
      }

      const tieneLetras = /[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(descripcion);
      if (!tieneLetras) {
        errorMensaje.textContent = "La descripción debe contener al menos una letra";
        errorMensaje.style.display = 'block';
        return false;
      }

      return { descripcion };
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await actualizar(reclamo.id, { 
          descripcion: result.value.descripcion 
        });
        showSuccessAlert("¡Éxito!", "Reclamo actualizado correctamente");
      } catch (err) {
        console.error("Error en actualización:", err);
      }
    }
  });
};

  const abrirModalEliminar = (reclamo) => {
  if (reclamo.estado === "contestado") {
    showErrorAlert("Reclamo contestado", "No puedes eliminar un reclamo que ya ha sido contestado.");
    return;
  }

  // Validar permisos
  if (permisos.puedeCrearReclamo && reclamo.rut_user !== permisos.userRut) {
    showErrorAlert("Sin permiso", "No puedes eliminar reclamos de otros usuarios");
    return;
  }

  // Los guardias no pueden eliminar
  if (permisos.esGuardia) {
    showErrorAlert("Sin permiso", "Los guardias no pueden eliminar reclamos.");
    return;
  }
  
  Swal.fire({
    title: '¿Eliminar Reclamo?',
    html: `
      <p>¿Estás seguro de eliminar este reclamo?</p>
      <p class="descripcion-reclamo">"${reclamo.descripcion.substring(0, 100)}${reclamo.descripcion.length > 100 ? '...' : ''}"</p>
      <p class="advertencia"><strong>Esta acción no se puede deshacer.</strong></p>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await eliminar(reclamo.id);
        showSuccessAlert("¡Éxito!", "Reclamo eliminado correctamente");
      } catch (err) {
        console.error("Error en eliminación:", err);
      }
    }
  });
};

  const handleContestarReclamo = (reclamo) => {
  Swal.fire({
    title: 'Contestar Reclamo',
    html: `
      <div style="text-align: left; margin-bottom: 15px;">
        <p><strong>Reclamo del usuario:</strong> ${reclamo.rut_user}</p>
        <p><strong>Descripción:</strong> ${reclamo.descripcion.substring(0, 150)}${reclamo.descripcion.length > 150 ? '...' : ''}</p>
      </div>
      <textarea id="respuesta-contestar" class="swal2-textarea" 
        placeholder="Escribe tu respuesta aquí (mínimo 10 caracteres)"
        rows="5"></textarea>
      <p class="swal2-validation-message" id="error-respuesta" style="display: none;"></p>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Enviar Respuesta',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const respuesta = document.getElementById('respuesta-contestar').value.trim();
      const errorRespuesta = document.getElementById('error-respuesta');
      
      if (!respuesta) {
        errorRespuesta.textContent = "La respuesta no puede estar vacía";
        errorRespuesta.style.display = 'block';
        return false;
      }
      
      if (respuesta.length < 10) {
        errorRespuesta.textContent = "La respuesta debe tener al menos 10 caracteres";
        errorRespuesta.style.display = 'block';
        return false;
      }

      const tieneLetras = /[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(respuesta);
      if (!tieneLetras) {
        errorRespuesta.textContent = "La respuesta debe contener al menos una letra";
        errorRespuesta.style.display = 'block';
        return false;
      }

      return { respuesta };
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await contestar(reclamo.id, { 
          respuesta: result.value.respuesta 
        });
        showSuccessAlert("¡Éxito!", "Reclamo contestado correctamente");
      } catch (err) {
        console.error("Error al contestar:", err);
      }
    }
  });
};

  const handleCambiarEstado = (reclamo) => {
  if (!permisos.esAdmin) {
    showErrorAlert("Sin permiso", "Solo los administradores pueden cambiar el estado de los reclamos.");
    return;
  }

  Swal.fire({
    title: 'Cambiar Estado del Reclamo',
    input: 'select',
    inputOptions: {
      'pendiente': 'Pendiente',
      'contestado': 'Contestado',
      'resuelto': 'Resuelto',
      'cerrado': 'Cerrado'
    },
    inputValue: reclamo.estado || 'pendiente',
    showCancelButton: true,
    confirmButtonText: 'Actualizar',
    cancelButtonText: 'Cancelar'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await cambiarEstado(reclamo.id, result.value);
        showSuccessAlert("¡Éxito!", `Reclamo marcado como ${result.value}`);
      } catch (err) {
        console.error("Error al cambiar estado:", err);
      }
    }
  });
};


const getEstadoColor = (estado) => {
  switch (estado?.toLowerCase()) {
    case 'pendiente': return '#ff9800';
    case 'contestado': return '#2196f3';
    case 'resuelto': return '#4caf50';
    case 'cerrado': return '#9e9e9e';
    default: return '#757575';
  }
};

  const verRespuestaReclamo = (reclamo) => {
  Swal.fire({
    title: 'Respuesta del Reclamo',
    html: `
      <div style="text-align: left;">
        <p><strong>Estado:</strong> <span style="color: ${getEstadoColor(reclamo.estado)}">${reclamo.estado?.toUpperCase()}</span></p>
        <p><strong>Contestado por:</strong> ${reclamo.contestado_por || 'No disponible'}</p>
        <p><strong>Fecha contestado:</strong> ${reclamo.fecha_contestado ? new Date(reclamo.fecha_contestado).toLocaleDateString('es-CL') : 'No disponible'}</p>
        <hr style="margin: 15px 0;">
        <p><strong>Descripción original:</strong></p>
        <div style="background: #f5f5f5; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
          ${reclamo.descripcion}
        </div>
        <p><strong>Respuesta:</strong></p>
        <div style="background: #e8f5e9; padding: 10px; border-radius: 5px;">
          ${reclamo.respuesta || 'No hay respuesta aún'}
        </div>
      </div>
    `,
    width: 600,
    confirmButtonText: 'Cerrar'
  });
};


  const renderReclamos = () => {
  if (loadingReclamos) {
    return (
    <tr>
        <td colSpan="7" className="loading-data">
          <div className="spinner"></div>
          Cargando reclamos...
        </td>
      </tr>
    );
  }
  if (!reclamos.length) {
    return (
      <tr>
        <td colSpan="7" className="no-data">
          No hay reclamos para mostrar
        </td>
      </tr>
    );
  }
  
  const reclamosParaMostrar = permisos.puedeVerTodos 
  ? reclamos 
  : reclamos.filter(r => r.rut_user === permisos.userRut);

  if (reclamosParaMostrar.length === 0) {
    return (
      <tr>
        <td colSpan="7" className="no-data">
          No tienes reclamos registrados
        </td>
      </tr>
    );
  }
  
  return reclamosParaMostrar.map(reclamo => (
    <ReclamoRow 
      key={reclamo.id}
      reclamo={reclamo}
      permisos={permisos}
      onEditar={() => abrirModalEditar(reclamo)}
      onEliminar={() => abrirModalEliminar(reclamo)}
      onContestar={() => handleContestarReclamo(reclamo)}
      onCambiarEstado={() => handleCambiarEstado(reclamo)}
      onVerRespuesta={() => verRespuestaReclamo(reclamo)}
    />
  ));
};

  return (
    <div className="reclamos-page">
      <h1>{permisos.tituloPagina}</h1>

      <EstadisticasReclamos estadisticas={estadisticas} puedeVerTodos={permisos.puedeVerTodos} />

      <WelcomeMessage 
      userName={permisos.userName} 
      puedeCrearReclamo={permisos.puedeCrearReclamo} 
      hasBicicletasPermitidas={hasBicicletasPermitidas} 
      cargandoBicicletas={cargandoBicicletas} />
      
      <BarraHerramientas 
        permisos={permisos} 
        mostrarFormulario={mostrarFormulario} 
        mostrarFiltros={mostrarFiltros} 
        tieneFiltrosActivos={tieneFiltrosActivos()} 
        hasBicicletasPermitidas={hasBicicletasPermitidas} 
        cargandoBicicletas={cargandoBicicletas} 
        onAbrirFormulario={handleAbrirFormulario} 
        onToggleFiltros={toggleFiltros} 
        onRefresh={fetchReclamos} 
        loadingReclamos={loadingReclamos} 
      />

      {mostrarFiltros && (
        <PanelFiltros 
          filtros={filtros} 
          actualizarFiltro={actualizarFiltro} 
          aplicarFiltros={aplicarFiltros} 
          limpiarFiltros={handleLimpiarFiltros} 
          puedeFiltrarRUT={permisos.puedeFiltrarRUT} 
          loadingReclamos={loadingReclamos} 
          tieneFiltrosActivos={tieneFiltrosActivos()} 
        />
      )}

      {permisos.puedeCrearReclamo && mostrarFormulario && (
        <div className="reclamo-form expandido">
          <div className="form-header">
            <h3>Nuevo Reclamo</h3>
            <button className="cerrar-form-btn" onClick={handleCancelar}>×</button>
          </div>
          <div className="form-inputs">
            <div className="input-group">
              <label htmlFor="descripcion">Descripción *</label>
              <textarea
                id="descripcion"
                placeholder="Describe el problema..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows="3"
              />
            </div>

            <div className="input-group">
              <label htmlFor="bicicleta-select">Bicicleta *</label>
              <SelectorBicicletas
                bicicletasPermitidas={bicicletasPermitidas}
                numeroSerie={numeroSerie}
                setNumeroSerie={setNumeroSerie}
                cargandoBicicletas={cargandoBicicletas}
                hasBicicletasPermitidas={hasBicicletasPermitidas}
              />
            </div>
          </div>


          <div className="form-actions">
            <button className="cancelar-btn" onClick={handleCancelar}>Cancelar</button>
            <button 
            className="reclamos-addbtn" 
            onClick={handleCrear} 
            disabled={!descripcion.trim() || !numeroSerie.trim()}>Crear Reclamo</button>
          </div>
        </div>
      )}


      <div className="reclamos-table-wrapper">
        <div className="table-header">
          <h3>{permisos.puedeVerTodos 
          ? `Todos los Reclamos (${reclamos.length})` 
          : `Mis Reclamos (${reclamos.filter(r => r.rut_user === permisos.userRut).length})`}
          </h3>
          {tieneFiltrosActivos() && <span className="filtros-activos-badge">Filtros activos</span>}
        </div>
        <div className="table-container">
          <table className="reclamos-table">
            <thead>
              <tr><th>ID</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Bicicleta</th>
              <th>Usuario</th>
              <th>Acciones</th>
              </tr>
              </thead>
            <tbody>
              {renderReclamos()}
              </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reclamos;