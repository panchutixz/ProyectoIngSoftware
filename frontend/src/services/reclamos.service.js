import axios from '@services/root.service.js';


//crear un reclamo
export async function crearReclamo(payload) {
    try {
        const response = await axios.post('/api/reclamos', payload);
        return response.data;
    } catch (error) {
        console.error("Error al crear el reclamo:", error);
        throw error;
    }
}

//obtener los reclamos del usuario 
export async function obtenerReclamos() {
  try {
      const response = await axios.get('/api/reclamos/mis-reclamos');
      return response.data.data;
    } catch (error) {
        console.error("Error al obtener los reclamos:", error);
        throw error;
    }
}

//actualizar un reclamo por id
export async function actualizarReclamo(id, payload) {
    try {
        const response = await axios.put(`/api/reclamos/${id}`, payload);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el reclamo:", error);
        throw error;
    }
}

//eliminar un reclamo por id
export async function eliminarReclamo(id) {
    try {
        const response = await axios.delete(`/api/reclamos/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el reclamo:", error);
        throw error;
    }
}