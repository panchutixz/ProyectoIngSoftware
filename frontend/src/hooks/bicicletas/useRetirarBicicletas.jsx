import { retirarBicicleta, moverBicycle } from "../../services/bicicletas.service";
import { getAllBikeRacks } from "../../services/bicicleteros.service.js";
import Swal from "sweetalert2";

async function accionBicicletaPopup(bicicleteros) {
    const bicicleteroOptions = bicicleteros
    .filter(b => b && b.id_bicicletero != null && b.nombre)
    .map(b => `<option value="${b.id_bicicletero}">${b.id_bicicletero} (${b.nombre})</option>`);

    const { value } = await Swal.fire({
    title: "Retirar/Mover Bicicleta",
    html: `
        <div style="display: grid; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px;">
            <label style="width: 120px;">Acción</label>
            <select id="swal2-accion" class="swal2-input">
            <option value="">Seleccione acción</option>
            <option value="retirar">Retirar</option>
            <option value="mover">Mover</option>
            </select>
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
        <label for="swal2-rut" style="width: 120px;">Rut</label>
        <input id="swal2-rut" class="swal2-input" placeholder="Rut Usuario">
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
        <label for="swal2-codigo" style="width: 120px;">Código bicicleta</label>
        <input id="swal2-codigo" class="swal2-input" placeholder="Código bicicleta">
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
    confirmButtonText: "Aceptar",
    preConfirm: () => {
        const accion = document.getElementById("swal2-accion").value.trim();
        const rut = document.getElementById("swal2-rut").value.trim();
        const codigo = document.getElementById("swal2-codigo").value.trim();
        const id_bicicletero = document.getElementById("swal2-id_bicicletero").value.trim();

        if (!accion || !rut || !codigo || !id_bicicletero) {
        Swal.showValidationMessage("Por favor, complete todos los campos");
            return false;
        }
        if (accion === "mover"){
            return { accion, rut, codigo, id_bicicletero_destino: id_bicicletero }; 
        } else {
            return { accion, rut, codigo, id_bicicletero }; 
        }
    },
    });

    return value || null;
}

export const accionBicicletas = (fetchAccionBicicletas) => {
    const handleAccionBicicleta = async () => {
    try {
        const bicicleteros = await getAllBikeRacks();
        const value = await accionBicicletaPopup(bicicleteros);
        if (!value) return;

        let response;
        if (value.accion === "retirar") {
        response = await retirarBicicleta(value);
        } else if (value.accion === "mover") {
        response = await moverBicycle(value);
        }

        if (response) {
        await Swal.fire({
            title: `Bicicleta ${value.accion} correctamente`,
            icon: "success",
            confirmButtonText: "Aceptar",
            timer: 2000,
            timerProgressBar: true,
        });
        await fetchAccionBicicletas();
        }
    } catch (error) {
        console.error("Error en acción bicicleta:", error);
        await Swal.fire({
        title: "No se pudo completar la acción",
        icon: "error",
        text: error.message || "Ha ocurrido un error inesperado, intentalo nuevamente",
        confirmButtonText: "Aceptar",
        timer: 2000,
        timerProgressBar: true,
        });
    }
    };
    return { handleAccionBicicleta };
};

export default accionBicicletaPopup;
