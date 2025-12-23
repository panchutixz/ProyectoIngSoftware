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
            <th>Asignar guardia</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(bikeRacks) && bikeRacks.length > 0 ? (
            bikeRacks.map((bikeRack) => {
              const guardiaActual = bikeRack.usuarios?.find(
                (u) => (u.rol || u.role || "").toString().toLowerCase() === "guardia"
              );
              const valorSelect = guardiaActual ? guardiaActual.id : "";

              return (
                <tr key={bikeRack.id_bicicletero}>
                  <td>{bikeRack.nombre}</td>
                  <td>{bikeRack.ubicacion}</td>
                  <td>
                    <select
                      value={valorSelect}
                      onChange={(e) => {
                        const valor = e.target.value;
                        handleAssignGuard(bikeRack.id_bicicletero, Number(valor));
                      }}
                      className="guard-select"
                    >
                      <option value="">- Sin guardia -</option>
                      {guards.map((guard) => (
                        <option key={guard.id} value={guard.id}>
                          {guard.nombre} {guard.apellido}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })
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