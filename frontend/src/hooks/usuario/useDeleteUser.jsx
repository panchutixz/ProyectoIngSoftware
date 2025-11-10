import { DeleteUsers } from "@services/usuarios.service.js";
import Swal from "sweetalert2";

async function confirmDeleteUsers() {
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
    title: "Usuario eliminado",
    text: "El Usuario ha sido eliminado correctamente",
    icon: "success",
    confirmButtonText: "Aceptar",
  });
}

async function confirmError() {
  await Swal.fire({
    title: "Error",
    text: "No se pudo eliminar al usuario",
    icon: "error",
    confirmButtonText: "Aceptar",
  });
}

export const useDeleteUsers = (fetchUsers) => {
  const handleDeleteUsers = async (userId) => {
    try {
      const isConfirmed = await confirmDeleteUsers();
      if (isConfirmed) {
        const response = await DeleteUsers(userId);
        if (response) {
          confirmAlert();
          await fetchUsers();
        }
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      confirmError();
    }
  };

    return { handleDeleteUsers };
};

export default useDeleteUsers;