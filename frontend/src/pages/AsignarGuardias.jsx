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
                    defaultValue={""}
                    onChange={(e) => {
                      const guardiaId = e.target.value;
                      if (guardiaId) {
                        handleAssignGuard(bikeRack.id_bicicletero, Number(guardiaId));
                      }
                    }}
                    className="guard-select"
                  >
                    <option value="">- Seleccionar Guardia -</option>
                    {guards.map((guard) => (
                      <option key={guard.id} value={guard.id}>
                        {guard.nombre} {guard.apellido}
                      </option>
                    ))}

                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No hay bicicleteros registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AsignarGuardias;