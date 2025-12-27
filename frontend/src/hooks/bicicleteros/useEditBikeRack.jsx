import Swal from "sweetalert2";
import { updateBikeRack } from "@services/bicicleteros.service.js";

async function editBikeRackPopup(bikeRack) {
    const { value: formValues } = await Swal.fire({
        title: "Editar Bicicletero",
        html: `
        <div>
          <label for="swal2-nombre">Nombre</label>
          <input id="swal2-nombre" class="swal2-input" placeholder="Nombre del bicicletero" value="${bikeRack.nombre}">
        </div>
        <div>
          <label for="swal2-capacidad">Capacidad</label>
          <input id="swal2-capacidad" class="swal2-input" placeholder="Capacidad del bicicletero" value="${bikeRack.capacidad}">
        </div>
        <div>
          <label for="swal2-ubicacion">Ubicación</label>
          <input id="swal2-ubicacion" class="swal2-input" placeholder="Ubicación del bicicletero" value="${bikeRack.ubicacion}">
        </div>
        <div>
          <label for="swal2-estado">Estado</label>
          <select id="swal2-estado" class="swal2-input" swal2-select">
            <option value="" disabled selected>Seleccione un estado</option>
            <option value="Abierto" ${bikeRack.estado.toLowerCase() === 'abierto' ? 'selected' : ''}>Habilitado</option>
            <option value="Cerrado" ${bikeRack.estado.toLowerCase() === 'cerrado' ? 'selected' : ''}>No habilitado</option>
          </select>
        </div>
    `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        didOpen: () => {
            const popup = Swal.getPopup();
            const style = document.createElement('style');
            style.innerHTML = `
        /* Force select to match swal2-input appearance */
        .swal2-select {
          height: 44px !important;
          padding: 8px 36px 8px 12px !important;
          box-sizing: border-box !important;
          border-radius: 4px !important;
          border: 1px solid #d9d9d9 !important;
          background-color: #fff !important;
          font-size: 14px !important;
          appearance: none !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          background-image: linear-gradient(45deg, transparent 50%, #555 50%), linear-gradient(135deg, #555 50%, transparent 50%);
          background-position: calc(100% - 18px) calc(50% - 6px), calc(100% - 12px) calc(50% - 6px);
          background-size: 8px 8px, 8px 8px;
          background-repeat: no-repeat;
          cursor: pointer;
        }
        /* keep labels aligned with inputs */
        .swal2-html-container > div { display:block; margin-bottom:12px; }
        .swal2-html-container label { display:block; margin-bottom:6px; font-weight:500; color:#333; }
      `;
            popup.appendChild(style);
        },
        preConfirm: () => {
            const nombre = document.getElementById("swal2-nombre").value.trim();
            const capacidad = document.getElementById("swal2-capacidad").value.trim();
            const ubicacion = document.getElementById("swal2-ubicacion").value.trim();
            const estado = document.getElementById("swal2-estado").value;

            if (!nombre || !capacidad || !ubicacion || !estado) {
                Swal.showValidationMessage("Por favor, complete todos los campos obligatorios");
                return false;
            }

            return { nombre, capacidad, ubicacion, estado };
        },
    });

    if (formValues) {
        return {
            nombre: formValues.nombre,
            capacidad: formValues.capacidad,
            ubicacion: formValues.ubicacion,
            estado: formValues.estado
        };
    }
    return null;
}

export const useEditBikeRack = (fetchBikeRacks) => {
    const handleEditBikeRack = async (bikeRack) => {
        try {
            // Muestra datos actuales
            const formValues = await editBikeRackPopup(bikeRack);
            if (!formValues) return;
            const response = await updateBikeRack(bikeRack.id_bicicletero, formValues);

            if (response) {
                await Swal.fire({
                    title: "Bicicletero actualizado exitosamente",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    timer: 2000,
                    timerProgressBar: true
                });
                await fetchBikeRacks();
            }

        } catch (error) {
            console.error("Error al actualizar el bicicletero:", error);
            await Swal.fire({
                title: "No se pudo actualizar el bicicletero",
                icon: "error",
                text: error.message || "Error en el servidor. Revisar datos e intentar nuevamente.",
                confirmButtonText: "Aceptar",
                timer: 2000,
                timerProgressBar: true
            });
        }
    };
    return { handleEditBikeRack };
};

export default useEditBikeRack;