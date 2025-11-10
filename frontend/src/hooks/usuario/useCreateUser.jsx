import Swal from "sweetalert2"
import { CreateUsers } from "@services/usuarios.service.js";

async function addUserPopup(){
    const {value: formValues } = await Swal.fire({
        title: "Añadir Usuario",
        html:`
        <div>
        <label for = "swal2-rut">Rut</label>
        <input id = "swal2-rut" class="swal2-input" placeholder="Rut del usuario">
        </div>
        <div>
        <label for = "swal2-nombre">Nombre</label>
        <input id = "swal2-nombre" class="swal2-input" placeholder="Nombre del usuario">
        </div>
         <div>
        <label for = "swal2-apellido">Apellido</label>
        <input id = "swal2-apellido" class="swal2-input" placeholder="Apellido del usuario">
        </div>
         <div>
        <label for = "swal2-email">Email</label>
        <input id = "swal2-email" class="swal2-input" placeholder="Email del usuario">
        </div>
         <div>
        <label for = "swal2-password">Contraseña</label>
        <input id = "swal2-password" class="swal2-input" placeholder="Contraseña del usuario">
        </div>
         <div>
        <label for = "swal2-rol">Rol</label>
        <input id = "swal2-rol" class="swal2-input" placeholder="Rol del usuario">
        </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Añadir",
    preConfirm: () => {
        const rut = document.getElementById("swal2-rut").value ;
        const nombre = document.getElementById("swal2-nombre").value ;
        const apellido = document.getElementById("swal2-apellido").value ;
        const email = document.getElementById("swal2-email").value ;
        const password = document.getElementById("swal2-password").value;
        const rol = document.getElementById("swal2-rol").value ;

        if(!rut || !nombre || !apellido || !email || !rol){
            Swal.showValidationMessage("Porfavor, Complete todos los campos");
            return false;
        }

        return {rut, nombre, apellido, email, password, rol};
    }, 
    });
    if(formValues){
        return{
            rut: formValues.rut,
            nombre: formValues.nombre,
            apellido: formValues.apellido,
            email: formValues.email,
            password: formValues.password,
            rol: formValues.rol,
        };
    }

    return null; //si se cancela
} 
export const useCreateUsers = (fetchUsers) => {
    const handleCreateUsers = async () => {
        try{
            const formValues = await addUsersPopup();
            if(!formValues) return;

            const response = await CreateUsers(formValues);
            if(response) {
                Swal.fire({
                    title: "Usuario añadido exitosamente!",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                })
                await fetchUsers();
            }

        }catch(error){
        console.error ("Error al añadir al usuario:", error);
        } 
    };   
    return {handleCreateUsers}
};

export default useCreateUsers;