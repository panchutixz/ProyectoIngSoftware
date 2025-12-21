import { retirarBicicleta } from "../../services/bicicletas.service";
import Swal from "sweetalert2";

async function retirarBicicletasPopup() {
    const {value } = await Swal.fire({
        title: "Retirar Bicicleta",
        html: `
            <div style="display: grid; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px;">
        <label for="swal2-rut" style="width: 120px;">Rut</label>
        <input id="swal2-rut" class="swal2-input" placeholder="Rut Usuario">
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
        <label for="swal2-Código bicicleta" style="width: 120px;">Código bicicleta</label>
        <input id="swal2-Código bicicleta" class="swal2-input" placeholder="Código bicicleta">
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
        <label for="swal2-id_bicicletero" style="width: 120px;">Bicicletero</label>
        <select id="swal2-id_bicicletero" class="swal2-input">
            <option value="">Seleccione un bicicletero</option>
            <option value="1">UBB - 1</option>
            <option value="2">UBB - 2</option>
            <option value="3">UBB - 3</option>
            <option value="4">UBB - 4</option>
        </select>
        </div>
    </div>

    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Retirar",
    preConfirm: () => {
        const rut = document.getElementById("swal2-rut").value.trim();
        const codigo = document.getElementById("swal2-Código bicicleta").value.trim();
        const id_bicicletero = document.getElementById("swal2-id_bicicletero").value.trim();

        if(!rut || !codigo || !id_bicicletero){
            Swal.showValidationMessage("Por favor, complete todos los campos");
            return false;
        }
        return {rut, codigo, id_bicicletero};
    },
    });
    if(value){
        return{
            rut: value.rut,
            codigo: value.codigo,
            id_bicicletero: value.id_bicicletero,
        };
    }
    return null;
}

export const retirarBicicletas = () => {
    const handleRetirarBicicleta = async () => {
        try{
            const value = await retirarBicicletasPopup();
            if(value){
                await retirarBicicleta(value);
                Swal.fire("Éxito", "Bicicleta retirada correctamente", "success");
            }
        }catch(error){
            console.error("Error al retirar la bicicleta:", error);
            await Swal.fire({
                title: "No se pudo retirar la bicicleta",
                icon: "error",
                text: error.message || "Ha ocurrido un error inesperado, intentalo nuevamente",
                confirmButtonText: "Aceptar",
            });
        }
    };
    return { handleRetirarBicicleta };
}

export default retirarBicicletasPopup;