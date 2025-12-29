import Swal from "sweetalert2";
import { CreateUsers } from "@services/usuarios.service.js";

async function addUserPopupGuard() {
  const { value: formValues } = await Swal.fire({
    title: "Añadir Usuario",
    html: `
      <div>
        <label for="swal2-rut">Rut</label>
        <input id="swal2-rut" class="swal2-input" placeholder="Rut del usuario">
      </div>
      <div>
        <label for="swal2-nombre">Nombre</label>
        <input id="swal2-nombre" class="swal2-input" placeholder="Nombre del usuario">
      </div>
      <div>
        <label for="swal2-apellido">Apellido</label>
        <input id="swal2-apellido" class="swal2-input" placeholder="Apellido del usuario">
      </div>
      <div>
        <label for="swal2-email">Email</label>
        <input id="swal2-email" class="swal2-input" placeholder="Email del usuario">
      </div>
      <div>
        <label for="swal2-password">Contraseña</label>
        <input id="swal2-password" type="password" class="swal2-input" placeholder="Contraseña del usuario">
      </div>
      <div>
        <label for="swal2-rol">Rol</label>
        <select id="swal2-rol" class="swal2-input swal2-select">
          <option value="" disabled selected>Seleccione el rol</option>
          <option value="Estudiante">Estudiante</option>
          <option value="Académico">Académico</option>
          <option value="Funcionario">Funcionario</option>
        </select>
      </div>
      <div>
        <label for="swal2-telefono">Teléfono</label>
        <input id="swal2-telefono" class="swal2-input" placeholder="Teléfono del usuario">
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Añadir",
    preConfirm: () => {
      const rut = document.getElementById("swal2-rut").value.trim();
      const nombre = document.getElementById("swal2-nombre").value.trim();
      const apellido = document.getElementById("swal2-apellido").value.trim();
      const email = document.getElementById("swal2-email").value.trim();
      const password = document.getElementById("swal2-password").value;
      const rol = document.getElementById("swal2-rol").value;
      const telefono = document.getElementById("swal2-telefono").value.trim();

      if (!rut || !nombre || !apellido || !email || !rol || !password) {
        Swal.showValidationMessage("Por favor, complete todos los campos obligatorios");
        return false;
      }

      return { rut, nombre, apellido, email, password, rol, telefono };
    }
  });

  return formValues || null;
}

export const useCreateUserGuard = (fetchUsers) => {
  const handleCreateUserGuard = async () => {
    try {
      const formValues = await addUserPopupGuard();
      if (!formValues) return;

      const response = await CreateUsers(formValues);
      if (response) {
        await Swal.fire({
          title: "Usuario añadido exitosamente!",
          icon: "success",
          confirmButtonText: "Aceptar",
          timer: 2000,
          timerProgressBar: true
        });
        await fetchUsers();
      }
    } catch (error) {
      console.error("Error al añadir al usuario:", error);
      await Swal.fire({
        title: "No se pudo crear el usuario",
        icon: "error",
        text: error.message || "Error en el servidor. Revisa los datos e inténtalo nuevamente.",
        confirmButtonText: "Aceptar",
        timer: 2000,
        timerProgressBar: true
      });
    }
  };

  return { handleCreateUserGuard };
};

export default useCreateUserGuard;
