import Swal from "sweetalert2";
import { assignGuardToBikeRack, unassignGuardFromBikeRack } from "@services/bicicleteros.service.js";

export const useAssignGuard = (refreshBikeRacks) => {
  const handleAssignGuard = async (id_bicicletero, id_guardia) => {
    try {
      const esAsignacion = !!id_guardia;

      if (esAsignacion) {
        await assignGuardToBikeRack(id_bicicletero, id_guardia);
      } else {
        await unassignGuardFromBikeRack(id_bicicletero);
      }

      if (refreshBikeRacks) await refreshBikeRacks();

      await Swal.fire({
        title: esAsignacion ? "Guardia asignado" : "Guardia desasignado",
        text: esAsignacion
            ? "El guardia ha sido vinculado al bicicletero exitosamente."
            : "El guardia ha sido desvinculado exitosamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
        timer: 2000, 
        timerProgressBar: true
      });

    } catch (error) {
      console.error("Error al asignar/desasignar guardia:", error);

      await Swal.fire({
        title: "Error en la operación",
        text: error.message || "Ocurrió un error inesperado al procesar la solicitud.",
        icon: "error",
        confirmButtonText: "Cerrar",
      });
    }
  };

  return { handleAssignGuard };
};