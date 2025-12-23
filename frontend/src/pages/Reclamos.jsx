import "@styles/reclamos.css";
import { useState, useEffect } from "react";
import { obtenerReclamos, crearReclamo, actualizarReclamo, eliminarReclamo } from "../services/reclamos.service.js";

const Reclamos = () => {
  const [reclamos, setReclamos] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [idBicicleta, setIdBicicleta] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReclamos();
  }, []);

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

  const handleCrear = async () => {
    try {
      await crearReclamo({
        descripcion,
        id_bicicleta: idBicicleta,
      });
      setDescripcion("");
      setIdBicicleta("");
      fetchReclamos();
    } catch (err) {
      console.error("Error al crear reclamo:", err);
    }
  };

  const handleActualizar = async (id) => {
    const nuevaDescripcion = prompt("Nueva descripción del reclamo:");
    if (!nuevaDescripcion) return;

    try {
      await actualizarReclamo(id, { descripcion: nuevaDescripcion });
      fetchReclamos();
    } catch (err) {
      console.error("Error al actualizar reclamo:", err);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar reclamo?")) return;

    try {
      await eliminarReclamo(id);
      fetchReclamos();
    } catch (err) {
      console.error("Error al eliminar reclamo:", err);
    }
  };

  return (
    <div className="reclamos-page">
      <h1>Mis Reclamos</h1>

      {/* Crear reclamo */}
      <div className="reclamo-form">
        <input
          type="text"
          placeholder="Descripción del reclamo"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <input
          type="number"
          placeholder="ID Bicicleta"
          value={idBicleta}
          onChange={(e) => setIdBicicleta(e.target.value)}
        />
        <button onClick={handleCrear}>Crear Reclamo</button>
      </div>

      {/* Tabla */}
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
          {reclamos.map((reclamo) => (
            <tr key={reclamo.id}>
              <td>{reclamo.id}</td>
              <td>{reclamo.descripcion}</td>
              <td>{reclamo.fecha_creacion}</td>
              <td>{reclamo.bicicleta?.id}</td>
              <td>{reclamo.usuario?.rut}</td>
              <td>
                <button onClick={() => handleActualizar(reclamo.id)}>
                  Editar
                </button>
                <button onClick={() => handleEliminar(reclamo.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Reclamos;