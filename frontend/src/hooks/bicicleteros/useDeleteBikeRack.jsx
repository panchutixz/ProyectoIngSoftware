import Swal from "sweetalert2";
import { deleteBikeRack } from "@services/bicicleteros.service.js";

async function confirmDeleteBikeRack() {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás deshacer esta acción",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });
  return result.isConfirmed;
}

async function confirmAlert() {
  await Swal.fire({
    title: "Bicicletero eliminado",
    text: "El Bicicletero ha sido eliminado correctamente",
    icon: "success",
    confirmButtonText: "Aceptar",
    timer: 2000,
    timerProgressBar: true
  });
}

async function confirmError() {
  await Swal.fire({
    title: "Error",
    text: "No se pudo eliminar al bicicletero",
    icon: "error",
    confirmButtonText: "Aceptar",
    timer: 2000,
    timerProgressBar: true
  });
}

export const useDeleteBikeRack = (fetchBikeRacks) => {
  const handleDeleteBikeRack = async (bikeRackId) => {
    try {
      const isConfirmed = await confirmDeleteBikeRack();
      if (isConfirmed) {
        const response = await deleteBikeRack(bikeRackId);
        if (response) {
          await confirmAlert();
          await fetchBikeRacks();
        }
      }
    } catch (error) {
      console.error("Error al eliminar bicicletero:", error);
      await confirmError();
    }
  };

  return { handleDeleteBikeRack };
};

export default useDeleteBikeRack;