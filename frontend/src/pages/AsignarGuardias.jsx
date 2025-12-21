import "@styles/asignarGuardias.css";
import useGetAllBikeRacks from "@hooks/bicicleteros/useGetAllBikeRacks.jsx";
import { useGetAllGuards } from "@hooks/bicicleteros/useGetAllGuards.jsx";
import { useAssignGuard } from "@hooks/bicicleteros/useAssignGuard.jsx";
import { useEffect } from "react";

const AsignarGuardias = () => {
  const { bikeRacks, fetchBikeRacks } = useGetAllBikeRacks();
  const { guards, fetchGuards } = useGetAllGuards();
  const { handleAssignGuard } = useAssignGuard(fetchBikeRacks);

  useEffect(() => {
    fetchBikeRacks();
    fetchGuards();
  }, []);

  return (
    <div className="asignarGuardias-page">
      <div className="asignarGuardias-header">
        <h2>Asignar guardias</h2>
      </div>

      <table className="asignarGuardias-table">
        <thead>
          <tr>
            <th>Bicicletero</th>
            <th>Ubicación</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(bikeRacks) && bikeRacks.length > 0 ? (
            bikeRacks.map((bikeRack) => (
              <tr key={bikeRack.id_bicicletero}>
                <td>{bikeRack.nombre}</td>
                <td>{bikeRack.ubicacion}</td>
                <td>
                  <select
                    value={bikeRack.id_guardia ?? ""}
                    onChange={(e) =>
                      handleAssignGuard(bikeRack.id_bicicletero, e.target.value)
                    }
                    className="guard-select"
                  >
                    <option value="">- Sin asignar -</option>
                    {guards.map((guard) => (
                      <option key={guard.id_guardia} value={guard.id_guardia}>
                        {guard.nombre}
                      </option>
                    ))}
                  </select>
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

export default AsignarGuardias;