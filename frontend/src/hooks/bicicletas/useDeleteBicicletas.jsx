import { eliminarBicycle } from "../../services/bicicletas.service";
import Swal from "sweetalert2";

async function DeleteBicicletasPoPup(){
    const {value} = await Swal.fire({
    tittle : "Eliminar Bicicleta",
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
                ${bicicleteroOptions}
        </select>
        </div>
    </div>
    `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Añadir",
        preConfirm: () => {
            const rut = document.getElementById("swal2-rut").value.trim()
            const codigo = document.getElementById("swal2-Código bicicleta").value.trim();
            const id_bicicletero = document.getElementById("swal2-id_bicicletero").value.trim();
    
            if(!rut ||!codigo || !id_bicicletero){
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

export const deleteBicicleta = (fetchDeleteBicicleta) => {
    const handleDeleteBicicleta = async () => {
        try{
        const value = await DeleteBicicletasPoPup();
        if(!value) return;

        const response = await eliminarBicycle(value);
        if(response){
            await Swal.fire({
            title: "Bicicleta eliminada correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
            timer: 2000,
            timerProgressBar: true
            })
            await fetchDeleteBicicleta();
        }

        }catch{
            console.error("Error al eliminar la bicicleta:", error);
            await Swal.fire({
            title: "No se pudo eliminar la bicicleta",
            icon: "error",
            text: error.message || "Ha ocurrido un error inesperado, intentalo nuevamente",
            confirmButtonText: "Aceptar",
            timer: 2000,
            timerProgressBar: true
            });
        }
    };
    return {handleDeleteBicicleta};
};

export default DeleteBicicletasPoPup;