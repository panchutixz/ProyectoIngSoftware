import axios from '@services/root.service.js';

export async function createBikeRack(data) {
    try {
        const response = await axios.post('auth/create/bicicletero', data);
        return response.data;
    }catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || JSON.stringify(error.response.data));
        }
        throw error;
    }
}

export async function getAllBikeRacks() {
    try{
        const response = await axios.get('/auth/getAll/bicicletero');
        return response.data.data;
    }catch(error){
        console.error("Error al obtener los bicicleteros:", error);
    }
}

export async function updateBikeRack(id, data) {
    try {
        const response = await axios.patch(`auth/update/bicicletero/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar bicicletero:", error);
    }
}

export async function deleteBikeRack(id_bicicletero) {
    try {
        const response = await axios.delete(`auth/delete/bicicletero?id_bicicletero=${id_bicicletero}`);
        return response.data;
    }catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || JSON.stringify(error.response.data));
        }
        throw error;
    }
}

export async function  getCapacity(id) {
    try {
        const response = await axios.get(`auth/getCapacity/bicicletero/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener la capacidad del bicicletero:", error);
    }
}