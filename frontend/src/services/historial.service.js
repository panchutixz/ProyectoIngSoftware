import axios from '@services/root.service.js';

export async function obtenerHistorial() {
    try {
        const response = await axios.get('/historial');
        console.log("Servicio - Respuesta completa:", response.data);
        // Devuelve response.data.data igual que getAllBikeRacks
        return response.data.data;
    } catch (error) {
        console.error("Error en obtenerHistorial:", error);
        // Manejo igual que bicicleteros
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || JSON.stringify(error.response.data));
        }
        throw error;
    }
}

export async function obtenerHistorialPorUsuario(rut) {
    try {
        const response = await axios.get(`/historial/${rut}`);
        console.log(`Servicio - Historial para ${rut}:`, response.data);
        // Devuelve response.data.data igual que getAllBikeRacks
        return response.data.data;
    } catch (error) {
        console.error(`Error obteniendo historial para ${rut}:`, error);
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || JSON.stringify(error.response.data));
        }
        throw error;
    }
}
