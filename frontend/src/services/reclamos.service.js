import axios from '@services/root.service.js';

//obtener bicicletas del usuario (para el dropdown)
export async function obtenerBicicletasUsuario() {
    try {
        const response = await axios.get('/reclamos/mis-bicicletas');
        console.log("Bicicletas del usuario obtenidas:", response.data.data);
        return response.data.data || [];
    } catch (error) {
        console.error("Error al obtener bicicletas del usuario:", error);
        throw error;
    }
}


//crear un reclamo
export async function crearReclamo(payload) {
    try {
        const response = await axios.post('/reclamos', payload);
        return response.data;
    } catch (error) {
        console.error("Error al crear el reclamo:", error);
        throw error;
    }
}

//obtener los reclamos del usuario 
export async function obtenerReclamos() {
  try {
      const response = await axios.get('/reclamos/mis-reclamos');
      console.log("=== SERVICIO: Respuesta completa ===");
      console.log("Status:", response.status);
      console.log("Data completa:", response.data);
      console.log("Data.data:", response.data.data);
      return response.data.data || [];
    } catch (error) {
        console.error("Error al obtener los reclamos:", error);
        throw error;
    }
}

//actualizar un reclamo por id
export async function actualizarReclamo(id, payload) {
    try {
        const response = await axios.put(`/reclamos/${id}`, payload);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el reclamo:", error);
        throw error;
    }
}

//eliminar un reclamo por id
export async function eliminarReclamo(id) {
    try {
        const response = await axios.delete(`/reclamos/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el reclamo:", error);
        throw error;
    }
}