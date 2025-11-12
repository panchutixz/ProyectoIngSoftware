import { registerBicicletas } from "../../services/bicicletas.service.js";
import Swal from "sweetalert2";

async function addBicicletasPopup() {
    const {value } = await Swal.fire({
        title: "Añadir Bicicleta",
        html: `
    <div>
        <label for="swal2-rut">Rut</label>
        <input id="swal2-rut" class="swal2-input" placeholder="Rut Usuario">
    </div>
    <div>
        <label for="swal2-marca">Marca</label>
        <input id="swal2-marca" class="swal2-input" placeholder="Marca de la bicicleta">
    </div>
    <div>
        <label for="swal2-color">Color</label>
        <input id="swal2-color" class="swal2-input" placeholder="Color de la bicicleta">
    </div>
    <div>
        <label for="swal2-numero_serie">Número Serie</label>
        <input id="swal2-numero_serie" class="swal2-input" placeholder="Número de serie de la bicicleta">
    </div>
    <div>
        <label for="swal2-descripcion">Descripción</label>
        <input id="swal2-descripcion" class="swal2-input" placeholder="Descripción de la bicicleta">
    </div>
    <div>
        <label for="swal2-estado">Estado</label>
        <input id="swal2-estado" class="swal2-input" placeholder="Estado de la bicicleta">
    </div>
    <div>
        <label for="swal2-id_bicicletero">ID Bicicletero</label>
        <input id="swal2-id_bicicletero" class="swal2-input" placeholder="ID del bicicletero">
    </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Añadir",
    preConfirm: () => {
        const rut = document.getElementById("swal2-rut").value.trim()
        const marca = document.getElementById("swal2-marca").value.trim();
        const color = document.getElementById("swal2-color").value.trim();
        const numero_serie = document.getElementById("swal2-numero_serie").value.trim();
        const descripcion = document.getElementById("swal2-descripcion").value.trim();
        const estado = document.getElementById("swal2-estado").value.trim();
        const id_bicicletero = document.getElementById("swal2-id_bicicletero").value.trim();

        if(!rut || !marca || !color || !numero_serie || !descripcion || !estado || !id_bicicletero){
            Swal.showValidationMessage("Por favor, complete todos los campos");
            return false;
        }
        return {rut, marca, color, numero_serie, descripcion, estado, id_bicicletero};
    },
    });
    if(value){
        return{
            rut: value.rut,
            marca: value.marca,
            color: value.color,
            numero_serie: value.numero_serie,
            descripcion: value.descripcion,
            estado: value.estado,
            id_bicicletero: value.id_bicicletero,
        };
    }
    return null;
}

export const registerBicicleta = (fetchRegisterBicicletas) => {
    const handleRegisterBicicleta = async () => {
        try{
            const value = await addBicicletasPopup();
            if(value){
                await registerBicicletas(value);
                Swal.fire("Éxito", "Bicicleta registrada correctamente", "success");
                fetchRegisterBicicletas();
            }
        }catch(error){
            console.error("Error al registrar la bicicleta:", error);
            await Swal.fire({
                title: "No se pudo registrar la bicicleta",
                icon: "error",
                text: error.message || "Ha ocurrido un error inesperado, intentalo nuevamente",
                confirmButtonText: "Aceptar",
            });
        }
    };
    return { handleRegisterBicicleta };
}

export default addBicicletasPopup;