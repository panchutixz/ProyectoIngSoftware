import "@styles/asignarGuardias.css";
import useGetAllBikeRacks from "@hooks/bicicleteros/useGetAllBikeRacks.jsx";
import { useEffect } from "react";

const VerGuardiasAsignados = () => {
  const { bikeRacks, fetchBikeRacks } = useGetAllBikeRacks();

  useEffect(() => {
    fetchBikeRacks();
  }, []);

  return (
    <div className="asignarGuardias-page">
      <div className="asignarGuardias-header">
        <h2>Guardias asignados actualmente</h2>
      </div>

      <table className="asignarGuardias-table">
        <thead>
          <tr>
            <th>Bicicletero</th>
            <th>Ubicación</th>
            <th>Guardia Asignado</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(bikeRacks) && bikeRacks.length > 0 ? (
            bikeRacks.map((bikeRack) => {
              const guardiaActual = bikeRack.usuarios?.find(
                (u) => (u.rol || u.role || "").toString().toLowerCase() === "guardia"
              );

              return (
                <tr key={bikeRack.id_bicicletero}>
                  <td>{bikeRack.nombre}</td>
                  <td>{bikeRack.ubicacion}</td>

                  <td>
                    {guardiaActual ? (
                      <span className="guardia-nombre">
                        {guardiaActual.nombre} {guardiaActual.apellido}
                      </span>
                    ) : (
                      <span style={{ color: "gray", fontStyle: "italic" }}>
                        - Sin guardia asignado -
                      </span>
                    )}
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

export default VerGuardiasAsignados;