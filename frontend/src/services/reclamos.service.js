import axios from '@services/root.service.js';

// obtener bicicletas del usuario (para el dropdown)
export async function obtenerBicicletasUsuario() {
    try {
        // Obtener el RUT del usuario
        const user = JSON.parse(sessionStorage.getItem("usuario")) || null;
        const userRut = user?.rut || "";
        
        if (!userRut) {
            console.error("No se encontró RUT en sessionStorage");
            throw new Error("Usuario no autenticado");
        }
        
        console.log("Consultando bicicletas para RUT:", userRut);
        
        const response = await axios.get(`/auth/usuario/${userRut}`);
        
        console.log("Respuesta del endpoint - Status:", response.status);
        console.log("Respuesta completa:", response.data);
        
        const bicicletasData = response.data?.message?.data || [];
    
        
        console.log("Bicicletas obtenidas:", bicicletasData);
        
        // Filtrar bicicletas del usuario actual
        const bicicletasFiltradas = bicicletasData.filter(bici => {
            const biciRut = bici.usuario?.rut || bici.usuarioRut || bici.rut_user;
            return biciRut === userRut;
        });
        
        console.log(`Bicicletas filtradas para ${userRut}:`, bicicletasFiltradas.length);
        
        return bicicletasFiltradas;
        
    } catch (error) {
        console.error("Error al obtener bicicletas:", {
            message: error.message,
            url: error.config?.url, // Esto mostrará la URL completa
            status: error.response?.status,
            data: error.response?.data
        });
        
        return [];
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


export async function contestarReclamo(id, payload) {
    try {
        const response = await axios.put(`/reclamos/${id}/contestar`, payload);
        return response.data;
    } catch (error) {
        console.error("Error al contestar el reclamo:", error);
        throw error;
    }
}


export async function cambiarEstadoReclamo(id, payload) {
    try {
        const response = await axios.put(`/reclamos/${id}/estado`, payload);
        return response.data;
    } catch (error) {
        console.error("Error al cambiar estado del reclamo:", error);
        throw error;
    }
}


export async function buscarReclamosFiltrados(filtros) {
    try {
        const params = new URLSearchParams();
        Object.entries(filtros).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        
        const response = await axios.get(`/reclamos/buscar?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error("Error al buscar reclamos filtrados:", error);
        throw error;
    }
}
