import "@styles/reclamos.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateReclamo } from "@hooks/reclamos/useCreateReclamo";
import { useGetReclamos } from "@hooks/reclamos/useGetReclamos";
import { useGetBicicletasUsuario } from "@hooks/reclamos/useGetBicicletasUsuario";
import { useEditReclamo } from "@hooks/reclamos/useEditReclamo";
import { useDeleteReclamo } from "@hooks/reclamos/useDeleteReclamo";
import { showErrorAlert, showSuccessAlert } from "../helpers/sweetAlert.js";

const Reclamos = () => {
  // estados del formulario
  const [descripcion, setDescripcion] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // estados para modales
  const [modalEditar, setModalEditar] = useState({
    abierto: false,
    id: null,
    descripcion: "",
    rutUsuario: ""
  });
  
  const [modalEliminar, setModalEliminar] = useState({
    abierto: false,
    id: null,
    descripcion: ""
  });

  // hooks personalizados
  const { 
    reclamos, 
    loading: loadingReclamos, 
    error: errorReclamos, 
    fetchReclamos 
  } = useGetReclamos();
  
  const { 
    registrarReclamo, 
    loading: creando, 
    error: errorCrear,
    success: exitoCrear,
    resetState: resetCrear 
  } = useCreateReclamo();
  
  const { 
    bicicletas, 
    loading: cargandoBicicletas, 
    error: errorBicicletas,
    fetchBicicletas,
    hasBicicletas 
  } = useGetBicicletasUsuario();
  
  const { 
    actualizar, 
    loading: actualizando, 
    error: errorActualizar,
    success: exitoActualizar,
    resetState: resetActualizar 
  } = useEditReclamo();
  
  const { 
    eliminar, 
    loading: eliminando, 
    error: errorEliminar,
    success: exitoEliminar,
    resetState: resetEliminar 
  } = useDeleteReclamo();

  // obtener usuario actual desde sessionStorage
  const user = JSON.parse(sessionStorage.getItem("usuario")) || null;
  const userRole = user?.rol || user?.role || "";
  const userRut = user?.rut || "";
  const userName = user?.nombre || user?.name || "";

  // definir tipos de usuario
  const esAdmin = userRole?.toLowerCase() === "administrador" || userRole?.toLowerCase() === "admin";
  const esGuardia = userRole?.toLowerCase() === "guardia";
  const esEstudiante = userRole?.toLowerCase() === "estudiante";
  const esAcademico = userRole?.toLowerCase() === "académico" || userRole?.toLowerCase() === "academico";
  const esFuncionario = userRole?.toLowerCase() === "funcionario";

  // permisos
  const puedeCrearReclamo = esEstudiante || esAcademico || esFuncionario;
  const puedeVerTodos = esAdmin || esGuardia;

  // navegacion
  const navigate = useNavigate();

  // efecto para cargar reclamos al inicio
  useEffect(() => {
    fetchReclamos();
  }, []);

  // efecto para cargar bicicletas cuando se abre el formulario
  useEffect(() => {
    if (mostrarFormulario && puedeCrearReclamo) {
      cargarBicicletasUsuario();
    }
  }, [mostrarFormulario]);

  // efecto para manejar exito en creacion
  useEffect(() => {
    if (exitoCrear) {
      fetchReclamos();
      resetCrear();
    }
  }, [exitoCrear]);

  // efecto para manejar éxito en la actualizacion
  useEffect(() => {
    if (exitoActualizar) {
      fetchReclamos();
      resetActualizar();
    }
  }, [exitoActualizar]);

  // efecto para manejar exito en la eliminación
  useEffect(() => {
    if (exitoEliminar) {
      fetchReclamos();
      resetEliminar();
    }
  }, [exitoEliminar]);

  // funcion para cargar bicicletas del usuario
  const cargarBicicletasUsuario = async () => {
    try {
      const bicis = await fetchBicicletas();
      if (bicis && bicis.length > 0 && !numeroSerie) {
        setNumeroSerie(bicis[0].numero_serie);
      }
    } catch (error) {
      console.error("Error cargando bicicletas:", error);
    }
  };

  // funcion para abrir formulario de creacion
  const handleAbrirFormulario = () => {
    // verificar rol antes de abrir
    const rolesPermitidos = ["estudiante", "académico", "funcionario"];
    if (!rolesPermitidos.includes(userRole.toLowerCase())) {
      showErrorAlert(
        "No autorizado", 
        "Solo estudiantes, académicos o funcionarios pueden crear reclamos."
      );
      return;
    }
    setMostrarFormulario(true);
  };

  // funcion para crear reclamo
  const handleCrear = async (e) => {
    e?.preventDefault();

    // validaciones
    if (!descripcion.trim()) {
      showErrorAlert("Campo requerido", "Por favor, ingresa una descripción del reclamo");
      return;
    }

    if (!numeroSerie.trim()) {
      showErrorAlert("Campo requerido", "Por favor, selecciona una bicicleta");
      return;
    }

    if (descripcion.trim().length < 10) {
      showErrorAlert("Descripción muy corta", "La descripción debe tener al menos 10 caracteres");
      return;
    }

    const tieneLetras = /[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(descripcion);
    if (!tieneLetras) {
      showErrorAlert("Descripción inválida", "La descripción debe contener al menos una letra");
      return;
    }

    try {
      const nuevoReclamo = {
        descripcion: descripcion.trim(),
        numero_serie_bicicleta: numeroSerie.trim()
      };

      await registrarReclamo(nuevoReclamo);
      
      // limpiar formulario
      setDescripcion("");
      setNumeroSerie("");
      setMostrarFormulario(false);
      
      showSuccessAlert("¡Éxito!", "Reclamo creado correctamente");
      
    } catch (err) {
      // el error ya es manejado por el hook
      console.error("Error en creación:", err);
    }
  };

  // funcion para abrir modal de edicion
  const abrirModalEditar = (id, descripcionActual, rutUsuarioReclamo) => {
    // validar permisos
    if (puedeCrearReclamo && rutUsuarioReclamo !== userRut) {
      showErrorAlert("Sin permiso", "No puedes editar reclamos de otros usuarios");
      return;
    }
    
    setModalEditar({
      abierto: true,
      id,
      descripcion: descripcionActual,
      rutUsuario: rutUsuarioReclamo
    });
  };

  // funcion para cerrar modal de edicion
  const cerrarModalEditar = () => {
    setModalEditar({
      abierto: false,
      id: null,
      descripcion: "",
      rutUsuario: ""
    });
  };

  // funcion para guardar edicion
  const handleGuardarEdicion = async () => {
    if (!modalEditar.descripcion.trim()) {
      showErrorAlert("Campo requerido", "La descripción no puede estar vacía");
      return;
    }

    if (modalEditar.descripcion.trim().length < 10) {
      showErrorAlert("Descripción muy corta", "La descripción debe tener al menos 10 caracteres");
      return;
    }

    const tieneLetras = /[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(modalEditar.descripcion);
    if (!tieneLetras) {
      showErrorAlert("Descripción inválida", "La descripción debe contener al menos una letra");
      return;
    }

    try {
      await actualizar(modalEditar.id, { 
        descripcion: modalEditar.descripcion.trim() 
      });
      
      cerrarModalEditar();
      showSuccessAlert("¡Éxito!", "Reclamo actualizado correctamente");
      
    } catch (err) {
      console.error("Error en actualización:", err);
    }
  };

  // funcion para abrir modal de eliminacion
  const abrirModalEliminar = (id, descripcionActual, rutUsuarioReclamo) => {
    // validar permisos para usuarios no admin/guardia
    if (puedeCrearReclamo && rutUsuarioReclamo !== userRut) {
      showErrorAlert("Sin permiso", "No puedes eliminar reclamos de otros usuarios");
      return;
    }
    
    setModalEliminar({
      abierto: true,
      id,
      descripcion: descripcionActual
    });
  };

  // funcion para cerrar modal de eliminacion
  const cerrarModalEliminar = () => {
    setModalEliminar({
      abierto: false,
      id: null,
      descripcion: ""
    });
  };

  // funcion para confirmar eliminacion
  const handleConfirmarEliminar = async () => {
    try {
      await eliminar(modalEliminar.id);
      cerrarModalEliminar();
      showSuccessAlert("¡Éxito!", "Reclamo eliminado correctamente");
    } catch (err) {
      console.error("Error en eliminación:", err);
    }
  };

  // funcion para cancelar el formulario
  const handleCancelar = () => {
    setDescripcion("");
    setNumeroSerie("");
    setMostrarFormulario(false);
  };

  // funcion para manejar tecla enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && puedeCrearReclamo) {
      handleCrear(e);
    }
  };

  // funcion para redirigir al perfil del usuario
  const verPerfilUsuario = (rut) => {
    if (rut && rut !== "No disponible" && (esAdmin || esGuardia)) {
      navigate(`/usuarios?rut=${rut}`);
    }
  };

  // renderizar filas de la tabla
  const renderReclamos = () => {
    if (loadingReclamos) {
      return (
        <tr>
          <td colSpan="6" className="loading-data">
            <div className="spinner"></div>
            Cargando reclamos...
          </td>
        </tr>
      );
    }

    if (!reclamos || reclamos.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="no-data">
            {puedeVerTodos 
              ? "No hay reclamos registrados en el sistema" 
              : "No tienes reclamos registrados"}
          </td>
        </tr>
      );
    }

    // filtrar reclamos si no es admin o guardia
    const reclamosFiltrados = puedeVerTodos 
      ? reclamos 
      : reclamos.filter(reclamo => reclamo.rut_user === userRut);

    if (reclamosFiltrados.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="no-data">
            No tienes reclamos registrados
          </td>
        </tr>
      );
    }

    return reclamosFiltrados.map((reclamo) => {
      const usuarioRut = reclamo.usuario?.rut || reclamo.rut_user || "No disponible";
      const bicicletaNumSerie = reclamo.bicicletas?.numero_serie || reclamo.numero_serie_bicicleta || "N/A";
      
      const fechaFormateada = reclamo.fecha_creacion ? 
        new Date(reclamo.fecha_creacion).toLocaleDateString('es-CL', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : "Fecha no disponible";

      return (
        <tr key={reclamo.id}>
          <td data-label="ID">{reclamo.id}</td>
          <td data-label="Descripción" className="descripcion-celda">
            <span title={reclamo.descripcion}>
              {reclamo.descripcion.length > 150 
                ? `${reclamo.descripcion.substring(0, 150)}...`
                : reclamo.descripcion}
            </span>
          </td>
          <td data-label="Fecha">{fechaFormateada}</td>
          <td data-label="Bicicleta">
            <span title={`N° Serie: ${bicicletaNumSerie}`}>
              {bicicletaNumSerie}
            </span>
          </td>
          <td data-label="Usuario">
            {usuarioRut !== "No disponible" && (esAdmin || esGuardia) ? (
              <span
                onClick={() => verPerfilUsuario(usuarioRut)}
                className="rut-clickable"
                title="Ver perfil del usuario"
              >
                {usuarioRut}
              </span>
            ) : (
              <span className="rut-no-disponible">{usuarioRut}</span>
            )}
          </td>
          <td data-label="Acciones">
            <div className="acciones-container">
              {/* boton de editar - solo para dueño o admin/guardia */}
              {(puedeCrearReclamo && usuarioRut === userRut) && (
                <button 
                  onClick={() => abrirModalEditar(reclamo.id, reclamo.descripcion, usuarioRut)}
                  className="btn-editar"
                  title="Editar reclamo"
                  disabled={actualizando}
                >
                  {actualizando && modalEditar.id === reclamo.id ? "Editando..." : "Editar"}
                </button>
              )}
              
              {/* boton de eliminar - siempre visible pero con validación interna */}
              <button 
                onClick={() => abrirModalEliminar(reclamo.id, reclamo.descripcion, usuarioRut)}
                className="btn-eliminar"
                title="Eliminar reclamo"
                disabled={eliminando}
              >
                {eliminando && modalEliminar.id === reclamo.id ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  // renderizar mensajes de error
  const renderErrores = () => {
    const errores = [];
    
    if (errorReclamos) errores.push("Error al cargar reclamos");
    if (errorCrear) errores.push("Error al crear reclamo");
    if (errorActualizar) errores.push("Error al actualizar reclamo");
    if (errorEliminar) errores.push("Error al eliminar reclamo");
    if (errorBicicletas) errores.push("Error al cargar bicicletas");

    if (errores.length > 0) {
      return (
        <div className="error-message">
          <strong>Se produjeron errores:</strong>
          <ul>
            {errores.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="reclamos-page">
      {/* titulo segun rol */}
      <h1>
        {puedeVerTodos 
          ? "Reclamos del Sistema" 
          : puedeCrearReclamo 
            ? "Mis Reclamos" 
            : "Reclamos"}
      </h1>

      {/* mensaje de bienvenida para usuarios */}
      {puedeCrearReclamo && (
        <div className="welcome-message">
          <p>Hola <strong>{userName}</strong>, aquí puedes gestionar tus reclamos sobre tus bicicletas.</p>
          {!hasBicicletas && (
            <p className="warning-message">
              <strong>Nota:</strong> Para crear un reclamo, primero debes registrar una bicicleta en la sección "Bicicletas".
            </p>
          )}
        </div>
      )}

      {/* BOTÓN CORREGIDO: Siempre visible para usuarios autorizados */}
      {puedeCrearReclamo && !mostrarFormulario && (
        <div className="crear-reclamo-btn-container">
          {hasBicicletas ? (
            <button 
              className="reclamos-addbtn"
              onClick={handleAbrirFormulario}
              disabled={cargandoBicicletas}
            >
              {cargandoBicicletas ? "Cargando..." : "Crear Nuevo Reclamo"}
            </button>
          ) : (
            <div className="no-bicicletas-alert">
              <p>No tienes bicicletas registradas para crear un reclamo.</p>
              <button 
                className="reclamos-addbtn-secondary"
                onClick={() => navigate('/bicicletas')}
              >
                Ir a Registrar Bicicleta
              </button>
            </div>
          )}
        </div>
      )}

      {/* formulario de creacion */}
      {puedeCrearReclamo && mostrarFormulario && (
        <div className="reclamo-form expandido">
          <div className="form-header">
            <h3>Nuevo Reclamo</h3>
            <button 
              className="cerrar-form-btn"
              onClick={handleCancelar}
              disabled={creando}
              aria-label="Cerrar formulario"
            >
              ×
            </button>
          </div>
          
          <div className="form-inputs">
            {/* campo descripcion */}
            <div className="input-group">
              <label htmlFor="descripcion">Descripción *</label>
              <textarea
                id="descripcion"
                placeholder="Describe el problema o situación (mínimo 10 caracteres, debe contener letras)"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={creando || cargandoBicicletas}
                rows="3"
                required
                minLength="10"
                className={descripcion.trim().length > 0 && descripcion.trim().length < 10 ? "error-input" : ""}
              />
              {descripcion.trim().length > 0 && descripcion.trim().length < 10 && (
                <p className="error-validacion">
                  Mínimo 10 caracteres ({descripcion.trim().length}/10)
                </p>
              )}
              {descripcion.trim().length > 0 && !/[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(descripcion) && (
                <p className="error-validacion">
                  La descripción debe contener al menos una letra
                </p>
              )}
            </div>

            {/* selector de bicicleta */}
            <div className="input-group">
              <label htmlFor="bicicleta-select">Seleccionar Bicicleta *</label>
              {cargandoBicicletas ? (
                <div className="loading-select">
                  <div className="spinner-small"></div>
                  Cargando tus bicicletas...
                </div>
              ) : !hasBicicletas ? (
                <div className="no-bicicletas-message">
                  <p>No tienes bicicletas registradas en el sistema.</p>
                  <p className="info-text">
                    Para crear un reclamo, primero debes registrar una bicicleta en la sección "Bicicletas".
                  </p>
                </div>
              ) : (
                <>
                  <select
                    id="bicicleta-select"
                    value={numeroSerie}
                    onChange={(e) => setNumeroSerie(e.target.value)}
                    disabled={creando || cargandoBicicletas || !hasBicicletas}
                    required
                    className="bicicleta-select"
                  >
                    <option value="">Selecciona una bicicleta</option>
                    {bicicletas.map((bicicleta) => (
                      <option 
                        key={bicicleta.id} 
                        value={bicicleta.numero_serie}
                        title={`${bicicleta.marca || 'Sin marca'} ${bicicleta.modelo || 'Sin modelo'} - ${bicicleta.color || 'Sin color'} (${bicicleta.estado || 'Sin estado'})`}
                      >
                        {bicicleta.numero_serie} - {bicicleta.marca || 'Sin marca'} {bicicleta.modelo || ''} ({bicicleta.color || 'Sin color'})
                      </option>
                    ))}
                  </select>
                  <p className="info-text">
                    Tienes {bicicletas.length} bicicleta{bicicletas.length !== 1 ? 's' : ''} registrada{bicicletas.length !== 1 ? 's' : ''}
                  </p>
                </>
              )}
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              className="cancelar-btn"
              onClick={handleCancelar}
              disabled={creando}
            >
              Cancelar
            </button>
            <button 
              className="reclamos-addbtn" 
              onClick={handleCrear}
              disabled={
                creando || 
                !numeroSerie.trim() || 
                !descripcion.trim() || 
                descripcion.trim().length < 10 ||
                !hasBicicletas ||
                !/[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(descripcion)
              }
              title={
                !hasBicicletas 
                  ? "No tienes bicicletas registradas" 
                  : descripcion.trim().length < 10 
                    ? "La descripción debe tener al menos 10 caracteres" 
                    : !/[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(descripcion)
                      ? "La descripción debe contener al menos una letra"
                      : ""
              }
            >
              {creando ? (
                <>
                  <span className="spinner-small"></span>
                  Creando...
                </>
              ) : "Crear Reclamo"}
            </button>
          </div>
        </div>
      )}

      {/* Tabla de reclamos */}
      <div className="reclamos-table-wrapper">
        <div className="table-header">
          <h3>
            {puedeVerTodos 
              ? `Todos los Reclamos (${reclamos.length})`
              : `Mis Reclamos (${reclamos.filter(r => r.rut_user === userRut).length})`}
          </h3>
          {!loadingReclamos && reclamos.length > 0 && (
            <button 
              className="refresh-btn"
              onClick={fetchReclamos}
              disabled={loadingReclamos}
              title="Actualizar lista"
            >
              {loadingReclamos ? "Actualizando..." : "🔄 Actualizar"}
            </button>
          )}
        </div>
        
        <div className="table-container">
          <table className="reclamos-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Descripción</th>
                <th>Fecha</th>
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

      {/* mostrar errores */}
      {renderErrores()}

      {/* modal para Editar */}
      {modalEditar.abierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Editar Reclamo</h3>
              <button className="modal-close" onClick={cerrarModalEditar}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Descripción del reclamo *</label>
                <textarea
                  value={modalEditar.descripcion}
                  onChange={(e) => setModalEditar(prev => ({...prev, descripcion: e.target.value}))}
                  placeholder="Describe el problema..."
                  rows="4"
                  autoFocus
                  className={modalEditar.descripcion.length > 0 && modalEditar.descripcion.length < 10 ? "error-input" : ""}
                />
                {modalEditar.descripcion.length > 0 && modalEditar.descripcion.length < 10 && (
                  <p className="error-validacion">
                    Mínimo 10 caracteres ({modalEditar.descripcion.length}/10)
                  </p>
                )}
                {modalEditar.descripcion.length > 0 && !/[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(modalEditar.descripcion) && (
                  <p className="error-validacion">
                    La descripción debe contener al menos una letra
                  </p>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancelar-btn" onClick={cerrarModalEditar}>
                Cancelar
              </button>
              <button 
                className="confirmar-btn" 
                onClick={handleGuardarEdicion}
                disabled={
                  modalEditar.descripcion.trim().length < 10 ||
                  !/[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(modalEditar.descripcion) ||
                  actualizando
                }
              >
                {actualizando ? (
                  <>
                    <span className="spinner-small"></span>
                    Guardando...
                  </>
                ) : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* modal para eliminar */}
      {modalEliminar.abierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirmar Eliminación</h3>
              <button className="modal-close" onClick={cerrarModalEliminar}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="confirmacion-texto">
                <p>¿Estás seguro de eliminar este reclamo?</p>
                <p className="descripcion-reclamo">"{modalEliminar.descripcion}"</p>
                <p className="advertencia">Esta acción no se puede deshacer.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancelar-btn" onClick={cerrarModalEliminar}>
                Cancelar
              </button>
              <button 
                className="eliminar-btn" 
                onClick={handleConfirmarEliminar}
                disabled={eliminando}
              >
                {eliminando ? (
                  <>
                    <span className="spinner-small"></span>
                    Eliminando...
                  </>
                ) : "Sí, Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reclamos;