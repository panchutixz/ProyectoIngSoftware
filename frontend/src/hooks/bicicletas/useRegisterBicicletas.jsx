import { registerBicicletas } from "../../services/bicicletas.service.js";
import { getAllBikeRacks } from "../../services/bicicleteros.service.js";
import Swal from "sweetalert2";

async function addBicicletasPopup(bicicleteros){
       const bicicleteroOptions = bicicleteros.filter(b => b && b.id_bicicletero != null && b.nombre).map(
        b => `<option value="${b.id_bicicletero}">${b.id_bicicletero} (${b.nombre})</option>`);

    const {value } = await Swal.fire({
        title: "Añadir Bicicleta",
        html: `
            <div style="display: grid; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px;">
        <label for="swal2-rut" style="width: 120px;">Rut</label>
        <input id="swal2-rut" class="swal2-input" placeholder="Rut Usuario">
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
        <label for="swal2-marca" style="width: 120px;">Marca</label>
        <select id="swal2-marca" class="swal2-input">
            <option value="">Seleccione una marca</option>
            <option value="Oxford">Oxford</option>
            <option value="Bianchi">Bianchi</option>
            <option value="Specialized">Specialized</option>
            <option value="Trek">Trek</option>
            <option value="Scott">Scott</option>
            <option value="Giant">Giant</option>
            <option value="Brabus">Brabus</option>
            <option value="Atletis">Atletis</option>
            <option value="Ozark Trail">Ozark Trail</option>
            <option value="Ford Bikes">Ford Bikes</option>

        </select>
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
        <label for="swal2-color" style="width: 120px;">Color</label>
        <select id="swal2-color" class="swal2-input">
            <option value="">Seleccione un color</option>
            <option value="Rojo">Rojo</option>
            <option value="Azul">Azul</option>
            <option value="Celeste">Celeste</option>
            <option value="Amarillo">Amarillo</option>
            <option value="Verde">Verde</option>
            <option value="Anaranjado">Anaranjado</option>
            <option value="Morado">Morado</option>
            <option value="Rosado">Rosado</option>
            <option value="Negro">Negro</option>
            <option value="Café">Café</option>
            <option value="Blanco">Blanco</option>
            <option value="Gris">Gris</option>

        </select>
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
        <label for="swal2-numero_serie" style="width: 120px;">Número Serie</label>
        <input id="swal2-numero_serie" class="swal2-input" placeholder="Número de serie">
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
        <label for="swal2-descripcion" style="width: 120px;">Descripción</label>
        <input id="swal2-descripcion" class="swal2-input" placeholder="Descripción de la bicicleta">
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
        <label for="swal2-estado" style="width: 120px;">Estado</label>
        <select id="swal2-estado" class="swal2-input">
            <option value="">Seleccione estado</option>
            <option value="guardada">Guardada</option>
        </select>
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
            const bicicleteros =  await getAllBikeRacks();
            const value = await addBicicletasPopup(bicicleteros);
            if(!value) return;
            
            const response = await registerBicicletas(value);
            if(response){
                await Swal.fire({
                title: "Bicicleta registrada correctamente",
                icon: "success",
                confirmButtonText: "Aceptar",
                timer: 2000,
                timerProgressBar: true
                })
                await fetchRegisterBicicletas();
            }

        }catch(error){
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
    return { handleRegisterBicicleta };
};

export default addBicicletasPopup;