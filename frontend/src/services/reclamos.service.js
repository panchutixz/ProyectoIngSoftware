import axios from '@services/root.service.js';

//obtener bicicletas del usuario (para el dropdown)
export async function obtenerBicicletasUsuario() {
    try {
        //obtener el RUT del usuario
        const user = JSON.parse(sessionStorage.getItem("usuario")) || null;
        const userRut = user?.rut || "";
        
        if (!userRut) {
            console.error("No se encontró RUT en sessionStorage");
            throw new Error("Usuario no autenticado");
        }
        
        console.log("Usando endpoint alternativo para RUT:", userRut);
        
        //usar el endpoint que SÍ funciona según bicicletas.service.js
        const response = await axios.get(`/auth/usuario/${userRut}`);
        
        // larespuesta viene en response.data.message.data según bicicletas.service.js
        const bicicletas = response.data?.message?.data || [];
        
        console.log("Bicicletas obtenidas:", bicicletas);
        return bicicletas;
        
    } catch (error) {
        console.error("Error al obtener bicicletas:", {
            message: error.message,
            response: error.response?.data
        });
        
        //datos mock para desarrollo
        console.log("Usando datos mock para continuar desarrollo");
        return [
            {
                id: 1,
                marca: 'Bianchi',
                color: 'Rosado',
                estado: 'guardada',
                numero_serie: '5455TGH8',
                codigo: '8824'
            }
        ];
    }
}

//crear un reclamo
export async function crearReclamo(payload) {
    try {
        console.log("=== INTENTANDO CREAR RECLAMO ===");
        console.log("Payload enviado:", payload);
        console.log("Endpoint: POST /reclamos");

        const response = await axios.post('/reclamos', payload);
        console.log("Respuesta exitosa:", response.data);
        return response.data;
    } catch (error) {
        console.error("=== ERROR DETALLADO AL CREAR RECLAMO ===");
        console.error("Status:", error.response?.status);
        console.error("Status Text:", error.response?.statusText);
        console.error("Error Data:", error.response?.data);
        console.error("Error Message:", error.message);
        console.error("Payload enviado:", payload);
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