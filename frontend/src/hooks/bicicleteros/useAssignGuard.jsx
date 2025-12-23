import Swal from "sweetalert2";
import { assignGuardToBikeRack, unassignGuardFromBikeRack } from "@services/bicicleteros.service.js";

export const useAssignGuard = (refreshBikeRacks) => {
  const handleAssignGuard = async (id_bicicletero, id_guardia) => {
    try {
      // Definimos si estamos asignando o desasignando para personalizar el mensaje
      const esAsignacion = !!id_guardia;

      if (esAsignacion) {
        await assignGuardToBikeRack(id_bicicletero, id_guardia);
      } else {
        await unassignGuardFromBikeRack(id_bicicletero);
      }

      // Si todo sale bien, refrescamos la tabla
      if (refreshBikeRacks) await refreshBikeRacks();

      // MOSTRAR MENSAJE DE ÉXITO (Estilo SweetAlert)
      await Swal.fire({
        title: esAsignacion ? "Guardia asignado" : "Guardia desasignado",
        text: esAsignacion
            ? "El guardia ha sido vinculado al bicicletero exitosamente."
            : "El guardia ha sido desvinculado exitosamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
        timer: 2000, // Se cierra solo a los 2 segundos (opcional)
        timerProgressBar: true
      });

    } catch (error) {
      console.error("Error al asignar/desasignar guardia:", error);

      // MOSTRAR MENSAJE DE ERROR (Estilo SweetAlert)
      // Esto hará que el error se vea igual que en tu hook de crear bicicletero
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