import { reIngresarBicicleta } from "../../services/bicicletas.service";
import { getAllBikeRacks } from "../../services/bicicleteros.service.js";
import Swal from "sweetalert2";

async function reIngresoBicicletasPopup(bicicleteros) {
    const bicicleteroOptions = bicicleteros.filter(b => b && b.id_bicicletero != null && b.nombre).map(
        b => `<option value="${b.id_bicicletero}">${b.id_bicicletero} (${b.nombre})</option>`);


    const {value } = await Swal.fire({
        title: "Re-Ingresar Bicicleta",
        html: `
            <div style="display: grid; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px;">
        <label for="swal2-rut" style="width: 120px;">Rut</label>
        <input id="swal2-rut" class="swal2-input" placeholder="Rut Usuario">
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
        <label for="swal2-Número de Serie" style="width: 120px;">Número de Serie</label>
        <input id="swal2-numero_serie" class="swal2-input" placeholder="numero_serie">
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
        <label for="swal2-id_bicicletero" style="width: 120px;">Bicicletero</label>
        <select id="swal2-id_bicicletero" class="swal2-input">
            <option value="">Seleccione un bicicletero</option>
                ${bicicleteroOptions}
        </select>
        </div>
    </div>

    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Re-Ingresar",
    preConfirm: () => {
        const rut = document.getElementById("swal2-rut").value.trim();
        const numero_serie = document.getElementById("swal2-numero_serie").value.trim();
        const id_bicicletero = document.getElementById("swal2-id_bicicletero").value.trim();

        if(!rut || !numero_serie || !id_bicicletero){
            Swal.showValidationMessage("Por favor, complete todos los campos");
            return false;
        }

        return {rut, numero_serie, id_bicicletero};

    },
    });
    if(value){
        return{
            rut: value.rut,
            numero_serie: value.numero_serie,
            id_bicicletero: value.id_bicicletero,
        };
    }
    return null;
}

export const reIngresoBicicleta = (fetchBicicletas) => {
    const handleReIngresoBicicleta = async () => {
    try {
        const bicicleteros =  await getAllBikeRacks();
        const value = await reIngresoBicicletasPopup(bicicleteros);
        if (!value) return;

        const response = await reIngresarBicicleta(value);
        if (response) {
        await Swal.fire({
        title: "Bicicleta re ingresada correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
        timer: 2000,
        timerProgressBar: true
        });
        await fetchBicicletas();
        }
    } catch (error) {
        console.error("Error al re ingresar la bicicleta:", error);
        await Swal.fire({
        title: "No se pudo re ingresar la bicicleta",
        icon: "error",
        text: error.message || "Ha ocurrido un error inesperado, intentalo nuevamente",
        confirmButtonText: "Aceptar",
        timer: 2000,
        timerProgressBar: true
        });
    }
    };
    return { handleReIngresoBicicleta };
};



export default reIngresoBicicletasPopup;