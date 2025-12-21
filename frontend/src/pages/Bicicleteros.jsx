import "@styles/bicicleteros.css";
import useGetAllBikeRacks from "@hooks/bicicleteros/useGetAllBikeRacks.jsx";
import useDeleteBikeRack from "@hooks/bicicleteros/useDeleteBikeRack.jsx";
import useCreateBikeRack from "@hooks/bicicleteros/useCreateBikeRack.jsx";
// import useGetCapacityBikeRack from '@hooks/bicicleteros/useGetCapacityBikeRack.jsx';
import { useEffect } from "react";

function transformarEstado(estado) {
  const estadoReal = estado;
  const estadoNormalizado = estadoReal.toLowerCase().trim();
  if (estadoNormalizado === "abierto") return "Habilitado";
  if (estadoNormalizado === "cerrado") return "No habilitado";
}

const BikeRacks = () => {
  const { bikeRacks, fetchBikeRacks } = useGetAllBikeRacks();
  // const { capacity, fetchCapacity } = useGetCapacityBikeRack();
  // const { handleGetCapacityBikeRack } = useGetCapacityBikeRack(fetchCapacity);
  const { handleDeleteBikeRack } = useDeleteBikeRack(fetchBikeRacks);
  const { handleCreateBikeRack } = useCreateBikeRack(fetchBikeRacks);

  useEffect(() => {
    fetchBikeRacks();
    // fetchCapacity();
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
            <th>Espacios ocupados</th>
            <th>Capacidad total</th>
            <th>Estado</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(bikeRacks) && bikeRacks.length > 0 ? (
            bikeRacks.map((bikeRack) => (
              <tr key={bikeRack.id_bicicletero}>
                <td>{bikeRack.nombre}</td>
                <td>{bikeRack.ubicacion}</td>
                <td></td>
                <td>{bikeRack.capacidad}</td>
                <td>{transformarEstado(bikeRack.estado)}</td>
                <td>
                  <button
                    className="capacity"
                    onClick={() =>
                      handleGetCapacityBikeRack(bikeRack.id_bicicletero)
                    }
                  >
                    Consultar espacios
                  </button>
                </td>
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
              <td colSpan="6">No hay bicicleteros registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BikeRacks;