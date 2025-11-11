import Swal from "sweetalert2";



async function RegistrarBicicletas () {
    const { isConfirmed, value } = await Swal.fire({
        title: "Añadir Bicicleta",
        html: `
        <label>Marca</label>
        <input id="swal2-titulo" class="swal2-input" placeholder="Marca de la bicicleta">

        <label>Color</label>
        <input id="swal2-descripcion" class="swal2-input" placeholder="Color de la bicicleta">

        <label>Número de Serie</label>
        <input id="swal2-fecha" type="date" class="swal2-input" placeholder="Número de serie">

        <label>Código</label>
        <input id="swal2-hora" type="time" class="swal2-input" placeholder="Código de la bicicleta">

        <label>Descripción</label>
        <input id="swal2-lugar" class="swal2-input" placeholder="Descripción de la bicicleta">

        <label>Estado</label>
        <input id="swal2-tipo" class="swal2-input" placeholder="estado de la bicicleta">

    >
        `,
        

    })
}

export default RegistrarBicicletas;