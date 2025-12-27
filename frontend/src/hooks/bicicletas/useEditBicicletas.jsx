import { editarBicycle } from "../../services/bicicletas.service";
import Swal from "sweetalert2";

async function editBicicletasPoPup(){
    const {value} = await Swal.fire({
    tittle : "Editar información Bicicleta",
    html: `
            <div style="display: grid; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px;">
        <label for="swal2-rut" style="width: 120px;">Rut</label>
        <input id="swal2-rut" class="swal2-input" placeholder="Rut Usuario">
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
        <label for="swal2-numero_serie" style="width: 120px;">Número Serie</label>
        <input id="swal2-numero_serie" class="swal2-input" placeholder="Número de serie">
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
        <label for="swal2-Código bicicleta" style="width: 120px;">Código bicicleta</label>
        <input id="swal2-Código bicicleta" class="swal2-input" placeholder="Código bicicleta">
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
        <label for="swal2-descripcion" style="width: 120px;">Descripción</label>
        <input id="swal2-descripcion" class="swal2-input" placeholder="Descripción de la bicicleta">
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
            const numero_serie = document.getElementById("swal2-numero_serie").value.trim();
            const codigo = document.getElementById("swal2-Código bicicleta").value.trim();
            const descripcion = document.getElementById("swal2-descripcion").value.trim();
            const id_bicicletero = document.getElementById("swal2-id_bicicletero").value.trim();
    
            if(!rut ||  !numero_serie ||!codigo|| !descripcion || !id_bicicletero){
                Swal.showValidationMessage("Por favor, complete todos los campos");
                return false;
            }
            return {rut, numero_serie, codigo , descripcion, id_bicicletero};
        },
    });
        if(value){
        return{
            rut: value.rut,
            numero_serie: value.numero_serie,
            codigo: value.codigo,
            descripcion: value.descripcion,
            id_bicicletero: value.id_bicicletero,
        };
    }
    return null;

}

export const editarBicicleta = (fetchEditBicicleta) => {
    const handleEditarBicicleta = async () => {
        try{
        const value = await editBicicletasPoPup();
        if(!value) return;

        const response = await editarBicycle(value);
        if(response){
            await Swal.fire({
            title: "Información de bicicleta editada correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
            timer: 2000,
            timerProgressBar: true
            })
            await fetchEditBicicleta();
        }

        }catch{
            console.error("Error al registrar la bicicleta:", error);
            await Swal.fire({
            title: "No se pudo registrar la bicicleta",
            icon: "error",
            text: error.message || "Ha ocurrido un error inesperado, intentalo nuevamente",
            confirmButtonText: "Aceptar",
            timer: 2000,
            timerProgressBar: true
            });
        }
    };
    return {handleEditarBicicleta};
};

export default editBicicletasPoPup;