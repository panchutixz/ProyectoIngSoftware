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

  // Usuarios que pueden crear reclamos
  const puedeCrearReclamo = esEstudiante || esAcademico || esFuncionario;

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
    setMostrarFormulario(false); // Cerrar formulario si no tiene permiso
    return;
  }

    // Validar campos
    if (!descripcion.trim()) {
      alert("Por favor, ingresa una descripción del reclamo");
      return;
    }
    
    if (!idBicicleta.trim()) {
      alert("Por favor, ingresa el ID de la bicicleta");
      return;
    }
    
    setCreando(true);
    try {
      console.log("Creando reclamo con:", { descripcion, idBicicleta });
      
      const nuevoReclamo = {
      descripcion: descripcion.trim(),
      id_bicicleta: idBicicleta.trim()  
      // 
    };

    console.log("Datos enviados al backend:", nuevoReclamo);
      
    await crearReclamo(nuevoReclamo);
      
    // Limpiar formulario y cerrarlo
    setDescripcion("");
    setIdBicicleta("");
    setError(null);
    setMostrarFormulario(false); // 
      
    // Recargar la lista
    await fetchReclamos();
      
    alert("Reclamo creado exitosamente!");
      
    } catch (err) {
    console.error("Error al crear reclamo:", err);
    
    let errorMessage = "Error al crear el reclamo";

    if (err.response) {
      // Error del servidor
      console.error("Response data:", err.response.data);
      console.error("Response status:", err.response.status);
      
      if (err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
        
        // Si hay multiples mensajes (array)
        if (Array.isArray(errorMessage)) {
          errorMessage = errorMessage.join(", ");
        }
      }
    } else if (err.request) {
      // Error de red
      errorMessage = "Error de conexión. Verifica tu internet.";
    } else {
      // Otros errores
      errorMessage = err.message;
    }
    
    setError(errorMessage);
    alert("Error: " + errorMessage);
    
  } finally {
    setCreando(false);
  }
};

  // Función para abrir modal de editar
  const abrirModalEditar = (id, descripcionActual) => {
    setModalEditar({
      abierto: true,
      id,
      descripcion: descripcionActual
    });
  };

  // Función para cerrar modal de editar
  const cerrarModalEditar = () => {
    setModalEditar({
      abierto: false,
      id: null,
      descripcion: ""
    });
  };

  // Función para guardar edición
  const handleGuardarEdicion = async () => {
    if (!modalEditar.descripcion.trim()) {
      alert("La descripción no puede estar vacía");
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
      alert("Error al actualizar el reclamo");
    }
  };

  // Función para abrir modal de eliminar
  const abrirModalEliminar = (id, descripcionActual) => {
    setModalEliminar({
      abierto: true,
      id,
      descripcion: descripcionActual
    });
  };

  // Función para cerrar modal de eliminar
  const cerrarModalEliminar = () => {
    setModalEliminar({
      abierto: false,
      id: null,
      descripcion: ""
    });
  };

  // Función para confirmar eliminación
  const handleConfirmarEliminar = async () => {
    try {
      await eliminarReclamo(modalEliminar.id);
      cerrarModalEliminar();
      await fetchReclamos();
      alert("Reclamo eliminado exitosamente");
    } catch (err) {
      console.error("Error al eliminar reclamo:", err);
      alert("Error al eliminar el reclamo");
    }
  };

  // funcion para manejar la tecla Enter en el formulario
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && puedeCrearReclamo) {
      handleCrear(e);
    }
  };

  // funcion para cancelar el formulario
  const handleCancelar = () => {
    setDescripcion("");
    setIdBicicleta("");
    setMostrarFormulario(false);
    setError(null);
  };


  // Función para redirigir al perfil del usuario
  const verPerfilUsuario = (rut) => {
    if (rut) {
      navigate(`/usuarios?rut=${rut}`);
    }
  };

  useEffect(() => {
    fetchReclamos();
  }, []);

 
  return (
    <div className="reclamos-page">
      {/* titulo condicional segun rol */}
      <h1>{esAdmin || esGuardia 
          ? "Reclamos" 
          : puedeCrearReclamo 
            ? "Mis Reclamos" 
            : "Reclamos"}
      </h1>

      {/* Mostrar botón para abrir formulario SOLO para usuarios */}
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

      {/* Mostrar formulario de creación cuando mostrarFormulario es true */}
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
              placeholder="Descripción del reclamo"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={creando}
              autoFocus
              required
            />
            <input
              type="number"
              placeholder="ID Bicicleta"
              value={idBicicleta}
              onChange={(e) => setIdBicicleta(e.target.value)}
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
              disabled={creando || !descripcion.trim() || !idBicicleta.trim()}
            >
              {creando ? "Creando..." : "Crear Reclamo"}
            </button>
          </div>
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
      {reclamos && reclamos.length > 0 ? (
        reclamos.map((reclamo) => {
          // Extraer datos de forma segura
          const usuarioRut = reclamo.usuario?.rut || 
                            reclamo.usuario_rut || 
                            "No disponible";
          
          const bicicletaId = reclamo.bicicletas?.id || 
                             reclamo.bicicleta?.id || 
                             reclamo.id_bicicleta || 
                             "N/A";
          
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
              <td data-label="Descripción">{reclamo.descripcion}</td>
              <td data-label="Fecha">{fechaFormateada}</td>
              <td data-label="Bicicleta">{bicicletaId}</td>
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
                {puedeCrearReclamo ? (
                  // estudiantes, academicos y funcionarios pueden editar y eliminar sus reclamos
                  <>
                    <button 
                      onClick={() => abrirModalEditar(reclamo.id, reclamo.descripcion)}
                      className="btn-editar"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => abrirModalEliminar(reclamo.id, reclamo.descripcion)}
                      className="btn-eliminar"
                    >
                      Eliminar
                    </button>
                  </>
                ) : (
                  // administradores y guardias solo pueden eliminar reclamos (cualquiera)
                  <button 
                    onClick={() => abrirModalEliminar(reclamo.id, reclamo.descripcion)}
                    className="admin-action-btn"
                  >
                    Eliminar
                  </button>
                )}
              </td>
            </tr>
          );
        })
      ) : (
        <tr>
          <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
            {esAdmin || esGuardia 
              ? "No hay reclamos registrados en el sistema" 
              : "No tienes reclamos registrados"}
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

    {error && <p className="error-message">{error}</p>}

    {/* Modal para Editar */}
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
                <label>Descripción del reclamo</label>
                <textarea
                  value={modalEditar.descripcion}
                  onChange={(e) => setModalEditar(prev => ({...prev, descripcion: e.target.value}))}
                  placeholder="Describe el problema..."
                  rows="4"
                  autoFocus
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancelar-btn" onClick={cerrarModalEditar}>
                Cancelar
              </button>
              <button className="confirmar-btn" onClick={handleGuardarEdicion}>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
  {/* Modal para Eliminar */}
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

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Reclamos;