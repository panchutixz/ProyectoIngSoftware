import "@styles/bicicleteros.css";
import useGetAllBikeRacks from "@hooks/bicicleteros/useGetAllBikeRacks.jsx";
import useDeleteBikeRack from "@hooks/bicicleteros/useDeleteBikeRack.jsx";
import useCreateBikeRack from "@hooks/bicicleteros/useCreateBikeRack.jsx";
import { useEffect } from "react";

function transformarEstado(estado) {
  const estadoReal = estado;
  if (!estadoReal) return "Desconocido";
  const estadoNormalizado = estadoReal.toLowerCase().trim();
  if (estadoNormalizado === "abierto") return "Habilitado";
  if (estadoNormalizado === "cerrado") return "No habilitado";
  return estadoReal;
}

const BikeRacks = () => {
  const { bikeRacks, fetchBikeRacks } = useGetAllBikeRacks();
  const { handleDeleteBikeRack } = useDeleteBikeRack(fetchBikeRacks);
  const { handleCreateBikeRack } = useCreateBikeRack(fetchBikeRacks);

  useEffect(() => {
    fetchBikeRacks();
  }, []);

  return (
    <div className="bicicleteros-page">
      <div className="bicicleteros-header">
        <h2>Lista de bicicleteros</h2>
        <button
          className="bicicleteros-addbtn"
          onClick={() => handleCreateBikeRack()}
        >
          Añadir
        </button>
      </div>

      <table className="bicicleteros-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ubicación</th>
            <th>Espacios disponibles</th>
            <th>Espacios ocupados</th>
            <th>Capacidad total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(bikeRacks) && bikeRacks.length > 0 ? (
            bikeRacks.map((bikeRack) => (
              <tr key={bikeRack.id_bicicletero}>
                <td>{bikeRack.nombre}</td>
                <td>{bikeRack.ubicacion}</td>
                <td style={{ fontWeight: "bold", color: "#388e3c" }}>
                  {bikeRack.disponibles ?? bikeRack.capacidad}
                </td>
                <td style={{ fontWeight: "bold", color: "#d32f2f" }}>
                  {bikeRack.ocupados ?? 0}
                </td>
                <td>{bikeRack.capacidad}</td>
                <td>{transformarEstado(bikeRack.estado)}</td>
                <td>
                  <button
                    className="delete"
                    onClick={() =>
                      handleDeleteBikeRack(bikeRack.id_bicicletero)
                    }
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No hay bicicleteros registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BikeRacks;