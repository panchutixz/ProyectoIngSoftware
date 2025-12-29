import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ReclamoRow = ({ 
  reclamo, 
  permisos, 
  onEditar, 
  onEliminar, 
  onContestar, 
  onCambiarEstado, 
  onVerRespuesta 
}) => {
  const navigate = useNavigate();
  
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

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pendiente': return '#ff9800';
      case 'contestado': return '#2196f3';
      case 'resuelto': return '#4caf50';
      case 'cerrado': return '#9e9e9e';
      default: return '#757575';
    }
  };

  const estadoColor = getEstadoColor(reclamo.estado);

  const verPerfilUsuario = (rut) => {
    if (rut && rut !== "No disponible" && (permisos.esAdmin || permisos.esGuardia)) {
      navigate(`/usuarios?rut=${rut}&highlight=true`);
    }
  };

  const verDetallesBicicleta = (numeroSerie) => {
    if (numeroSerie && numeroSerie !== "N/A") {
      navigate(`/bicicletas?serie=${numeroSerie}&highlight=true`);
    }
  };

  return (
    <tr>
      <td>{reclamo.id}</td>
      <td className="descripcion-celda">
        <span title={reclamo.descripcion}>
          {reclamo.descripcion.length > 100 
            ? `${reclamo.descripcion.substring(0, 100)}...`
            : reclamo.descripcion}
        </span>
      </td>
      <td>{fechaFormateada}</td>
      <td>
        <span 
          className="estado-badge"
          style={{ backgroundColor: estadoColor }}
          onClick={permisos.esAdmin ? () => onCambiarEstado(reclamo) : undefined}
          title={permisos.esAdmin ? "Click para cambiar estado" : ""}
        >
          {reclamo.estado?.toUpperCase() || 'PENDIENTE'}
        </span>
      </td>
      <td>
        <span 
          onClick={() => verDetallesBicicleta(bicicletaNumSerie)}
          className={bicicletaNumSerie !== "N/A" ? 'clickeable' : ''}
          title="Ver detalles de la bicicleta"
        >
          {bicicletaNumSerie}
        </span>
      </td>
      <td>
        {usuarioRut !== "No disponible" && (permisos.esAdmin || permisos.esGuardia) ? (
          <span
            onClick={() => verPerfilUsuario(usuarioRut)}
            className="rut-clickable"
            title="Ver perfil del usuario"
          >
            {usuarioRut}
          </span>
        ) : (
          <span>{usuarioRut}</span>
        )}
      </td>
      <td>
        <div className="acciones-container">
          {/* Botones según el estado del reclamo y permisos */}
          {reclamo.estado === "contestado" || reclamo.respuesta ? (
            <button 
              onClick={() => onVerRespuesta(reclamo)}
              className="btn-ver-respuesta"
              title="Ver respuesta"
            >
              <i className="fas fa-eye"></i> Ver respuesta
            </button>
          ) : (
            <>
              {/* Botón Editar - solo dueño o admin */}
              {((permisos.puedeCrearReclamo && usuarioRut === permisos.userRut) || permisos.esAdmin) && (
                <button 
                  onClick={() => onEditar(reclamo)}
                  className="btn-editar"
                  title="Editar reclamo"
                >
                  <i className="fas fa-edit"></i> Editar
                </button>
              )}
              
              {/* Botón Contestar - solo admin/guardia */}
              {(permisos.esAdmin || permisos.esGuardia) && (
                <button 
                  onClick={() => onContestar(reclamo)}
                  className="btn-contestar"
                  title="Contestar reclamo"
                >
                  <i className="fas fa-reply"></i> Contestar
                </button>
              )}
              
              {/* Botón Eliminar - solo dueño o admin (no guardias) */}
              {(usuarioRut === permisos.userRut || permisos.esAdmin) && !permisos.esGuardia && (
                <button 
                  onClick={() => onEliminar(reclamo)}
                  className="btn-eliminar"
                  title="Eliminar reclamo"
                >
                  <i className="fas fa-trash"></i> Eliminar
                </button>
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  );
};