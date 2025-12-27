import axios from '@services/root.service.js';

export async function createBikeRack(data) {
    try {
        const response = await axios.post('auth/create/bicicletero', data);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || JSON.stringify(error.response.data));
        }
        throw error;
    }
}

export async function getAllBikeRacks() {
    try {
        const response = await axios.get('/auth/getAll/bicicletero');
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener los bicicleteros:", error);
    }
}

export async function updateBikeRack(id, data) {
    try {
        const response = await axios.patch(`auth/update/bicicletero?id_bicicletero=${id}`, data);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || JSON.stringify(error.response.data));
        }
        throw error;
    }
}

export async function deleteBikeRack(id_bicicletero) {
    try {
        const response = await axios.delete(`auth/delete/bicicletero?id_bicicletero=${id_bicicletero}`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || JSON.stringify(error.response.data));
        }
        throw error;
    }
}

export async function getCapacity(id) {
    try {
        const response = await axios.get(`auth/getCapacity/bicicletero/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener la capacidad del bicicletero:", error);
    }
}

export const assignGuardToBikeRack = async (id_bicicletero, userId) => {
    try {
        const response = await axios.post("auth/asignar/bicicletero", {
            id_bicicletero: id_bicicletero,
            id: userId,
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || JSON.stringify(error.response.data));
        }
        throw error;
    }
};

export const unassignGuardFromBikeRack = async (id_bicicletero) => {
    const response = await axios.patch("/auth/desasignar/bicicletero/", {
        
        id_bicicletero,
    });
    return response.data.data;
};

export const getAllGuards = async () => {
    const res = await axios.get("/auth/guardias");
    return res.data.data;
};

export async function getBikeRackHistory(id, filters = {}) {
    try {
        let url = `auth/bicicletero/${id}/historial?`;
        
        if (filters.rut) url += `rut=${filters.rut}&`;
        if (filters.fecha) url += `fecha=${filters.fecha}`;

        const response = await axios.get(url);
        return response.data; 
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || JSON.stringify(error.response.data));
        }
        console.error("Error al obtener el historial del bicicletero:", error);
        throw error;
    }
}