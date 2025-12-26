import "@styles/reclamos.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerReclamos, crearReclamo, actualizarReclamo, eliminarReclamo } from "../services/reclamos.service.js";

const Reclamos = () => {
  const [reclamos, setReclamos] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [error, setError] = useState(null);
  const [creando, setCreando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false); 

  const [modalEditar, setModalEditar] = useState({
    abierto: false,
    id: null,
    descripcion: ""
  });
  
  const [modalEliminar, setModalEliminar] = useState({
    abierto: false,
    id: null,
    descripcion: ""
  });

  // obtener usuario actual y rol
  const user = JSON.parse(sessionStorage.getItem("usuario")) || null;
  const userRole = user?.rol || user?.role || "";
  const userRut = user?.rut || "";

  // definir tipos de usuario
  const esAdmin = userRole?.toLowerCase() === "administrador" || userRole?.toLowerCase() === "admin";
  const esGuardia = userRole?.toLowerCase() === "guardia";
  const esEstudiante = userRole?.toLowerCase() === "estudiante";
  const esAcademico = userRole?.toLowerCase() === "académico" || userRole?.toLowerCase() === "academico";
  const esFuncionario = userRole?.toLowerCase() === "funcionario";

  // usuarios que pueden crear reclamos
  const puedeCrearReclamo = esEstudiante || esAcademico || esFuncionario;
  // usuarios que pueden ver todos los reclamos
  const puedeVerTodos = esAdmin || esGuardia;

  // para navegacion
  const navigate = useNavigate();

   const fetchReclamos = async () => {
    try {
      const data = await obtenerReclamos();
      console.log("Respuesta backend reclamos:", data);
      setReclamos(data);
    } catch (err) {
      console.error("Error al cargar reclamos:", err);
      setError("No se pudieron cargar los reclamos");
    }
  };

  const handleCrear = async (e) => {
    e?.preventDefault();

    // Verificar que el usuario tenga un rol valido para crear reclamos
  const rolesPermitidos = ["estudiante", "académico", "funcionario", "Estudiante", "Académico", "Funcionario"];
  const userRol = user?.rol || "";
  
  if (!rolesPermitidos.includes(userRol)) {
    alert("Solo estudiantes, académicos o funcionarios pueden crear reclamos. Tu rol actual no está autorizado.");
    setMostrarFormulario(false); //cerrar formulario si no tiene permiso
    return;
  }

    // Validar campos
    if (!descripcion.trim()) {
      alert("Por favor, ingresa una descripción del reclamo");
      return;
    }
    
    if (!numeroSerie.trim()) {
      alert("Por favor, ingresa el número de serie de la bicicleta");
      return;
    }

    // validar longitud minima de descripcion (segun backend son minimo 10 caracteres)
    if (descripcion.trim().length < 10) {
      alert("La descripción debe tener al menos 10 caracteres");
      return;
    }

    // validar que la descripcion contenga letras segun backend
    const tieneLetras = /[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(descripcion);
    if (!tieneLetras) {
      alert("La descripción debe contener al menos una letra");
      return;
    }
    
    setCreando(true);
    try {
      console.log("Creando reclamo con:", { descripcion, numeroSerie });
      
      const nuevoReclamo = {
      descripcion: descripcion.trim(),
      numero_serie_bicicleta: numeroSerie.trim()
    };

    console.log("Datos enviados al backend:", nuevoReclamo);
      
    await crearReclamo(nuevoReclamo);
      
    // Limpiar formulario y cerrarlo
    setDescripcion("");
    setNumeroSerie("");
    setError(null);
    setMostrarFormulario(false); // 
      
     //recargar la lista
      await fetchReclamos();
      
      alert("Reclamo creado exitosamente!");
      
    } catch (err) {
      console.error("Error al crear reclamo:", err);
      
      let errorMessage = "Error al crear el reclamo";

      if (err.response) {
        // error del servidor
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        
        if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
          
          //si hay multiples mensajes
          if (Array.isArray(errorMessage)) {
            errorMessage = errorMessage.join(", ");
          }
        } else if (err.response.data && err.response.data.error) {
          errorMessage = err.response.data.error;
        }
      } else if (err.request) {
        //error de red
        errorMessage = "Error de conexión. Verifica tu internet.";
      } else {
        //otros errores
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      alert("Error: " + errorMessage);
      
    } finally {
      setCreando(false);
    }
  };

  //funcion para abrir modal de editar con la validacion
  const abrirModalEditar = (id, descripcionActual, rutUsuarioReclamo) => {
      //verificar si el usuario puede editar este reclamo
    if (puedeCrearReclamo) {
      //si es estudiante/academico/funcionario solo puede editar sus propios reclamos
      if (rutUsuarioReclamo !== userRut) {
        alert("No puedes editar reclamos de otros usuarios");
        return;
      }
    }
    
    setModalEditar({
      abierto: true,
      id,
      descripcion: descripcionActual
    });
  };

  // funcion para cerrar modal de editar
  const cerrarModalEditar = () => {
    setModalEditar({
      abierto: false,
      id: null,
      descripcion: ""
    });
  };

  //funcion para guardar edición
  const handleGuardarEdicion = async () => {
    if (!modalEditar.descripcion.trim()) {
      alert("La descripción no puede estar vacía");
      return;
    }

    //validaciones similares a la creacion
    if (modalEditar.descripcion.trim().length < 10) {
      alert("La descripción debe tener al menos 10 caracteres");
      return;
    }

    const tieneLetras = /[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(modalEditar.descripcion);
    if (!tieneLetras) {
      alert("La descripción debe contener al menos una letra");
      return;
    }

    try {
      await actualizarReclamo(modalEditar.id, { 
        descripcion: modalEditar.descripcion.trim() 
      });
      
      cerrarModalEditar();
      await fetchReclamos();
      alert("Reclamo actualizado exitosamente!");
      
    } catch (err) {
      console.error("Error al actualizar reclamo:", err);
      let errorMsg = "Error al actualizar el reclamo";
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
        if (Array.isArray(errorMsg)) {
          errorMsg = errorMsg.join(", ");
        }
      }
      alert(errorMsg);
    }
  };

  // funcion para abrir modal de eliminar
  const abrirModalEliminar = (id, descripcionActual) => {
    setModalEliminar({
      abierto: true,
      id,
      descripcion: descripcionActual
    });
  };

  // funcion para cerrar modal de eliminar
  const cerrarModalEliminar = () => {
    setModalEliminar({
      abierto: false,
      id: null,
      descripcion: ""
    });
  };

  // funcion para confirmar eliminación
  const handleConfirmarEliminar = async () => {
    try {
      await eliminarReclamo(modalEliminar.id);
      cerrarModalEliminar();
      await fetchReclamos();
      alert("Reclamo eliminado exitosamente");
    } catch (err) {
      console.error("Error al eliminar reclamo:", err);
      let errorMsg = "Error al eliminar el reclamo";
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      alert(errorMsg);
    }
  };

  //funcion para manejar la tecla Enter en el formulario
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && puedeCrearReclamo) {
      handleCrear(e);
    }
  };

  // funcion para cancelar el formulario
  const handleCancelar = () => {
    setDescripcion("");
    setNumeroSerie("");
    setMostrarFormulario(false);
    setError(null);
  };


  // funcion para redirigir al perfil del usuario
  const verPerfilUsuario = (rut) => {
    if (rut && rut !== "No disponible") {
      navigate(`/usuarios?rut=${rut}`);
    }
  };

  useEffect(() => {
    fetchReclamos();
  }, []);

  //funcion para generar las filas de la tabla
  const renderReclamos = () => {
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

    return reclamos.map((reclamo) => {
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
              {reclamo.descripcion.length > 100 
                ? `${reclamo.descripcion.substring(0, 100)}...`
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
            {usuarioRut !== "No disponible" ? (
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
              {(puedeCrearReclamo && usuarioRut === userRut) && (
                <button 
                  onClick={() => abrirModalEditar(reclamo.id, reclamo.descripcion, usuarioRut)}
                  className="btn-editar"
                  title="Editar reclamo"
                >
                  Editar
                </button>
              )}
              
              <button 
                onClick={() => abrirModalEliminar(reclamo.id, reclamo.descripcion)}
                className="btn-eliminar"
                title="Eliminar reclamo"
              >
                Eliminar
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

 
  return (
    <div className="reclamos-page">
      {/* titulo correspondiente segun rol */}
      <h1>{puedeVerTodos 
          ? "Reclamos" 
          : puedeCrearReclamo 
            ? "Mis Reclamos" 
            : "Reclamos"}
      </h1>

      {/* mostrar boton para abrir formulario SOLO para usuarios */}
      {puedeCrearReclamo && !mostrarFormulario && (
        <div className="crear-reclamo-btn-container">
          <button 
            className="reclamos-addbtn"
            onClick={() => setMostrarFormulario(true)}
          >
            Crear Reclamo
          </button>
        </div>
      )}

      {/* mostrar formulario de creacion cuando mostrarFormulario es true */}
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
            <input
              type="text"
              placeholder="Descripción del reclamo (mínimo 10 caracteres)"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={creando}
              autoFocus
              required
              minLength="10"
            />
            <input
              type="text"
              placeholder="número Serie de Bicicleta"
              value={numeroSerie}
              onChange={(e) => setNumeroSerie(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={creando}
              required
            />
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
              disabled={creando || !numeroSerie.trim() || !descripcion.trim() || descripcion.trim().length < 10}
              title={descripcion.trim().length < 10 ? "La descripción debe tener al menos 10 caracteres" : ""}
            >
              {creando ? "Creando..." : "Crear Reclamo"}
            </button>
          </div>

          {descripcion.trim().length > 0 && descripcion.trim().length < 10 && (
            <p className="error-validacion" style={{color: 'red', fontSize: '12px', marginTop: '5px'}}>
              La descripción debe tener al menos 10 caracteres ({descripcion.trim().length}/10)
            </p>
          )}
        </div>
      )}

      {/* Tabla */}
<div className="reclamos-table-wrapper">
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

      {error && <p className="error-message">{error}</p>}

      {/* modal para editar */}
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
                <label>Descripción del reclamo (mínimo 10 caracteres, debe contener letras)</label>
                <textarea
                  value={modalEditar.descripcion}
                  onChange={(e) => setModalEditar(prev => ({...prev, descripcion: e.target.value}))}
                  placeholder="Describe el problema..."
                  rows="4"
                  autoFocus
                />
                {modalEditar.descripcion.length > 0 && modalEditar.descripcion.length < 10 && (
                  <p className="error-validacion" style={{color: 'red', fontSize: '12px', marginTop: '5px'}}>
                    Mínimo 10 caracteres ({modalEditar.descripcion.length}/10)
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
                disabled={modalEditar.descripcion.trim().length < 10}
              >
                Guardar Cambios
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
              <button className="eliminar-btn" onClick={handleConfirmarEliminar}>
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reclamos;