import axios from '@services/root.service.js';


export async function GetUsers() {
    try {
        const response = await axios.get('/users');
        return response.data;
    } catch (error) {
        console.error("Error al obtener los Usuarios:", error);
    }
}

export async function DeleteUsers(userId){
    try{
    const response = await axios.delete(`/users/${userId}`);
    return response.data;
    }catch (error) {
        console.error("Error al eliminar al usuario", error);
    }
}

export async function editUser(userId, userData) { 
    try {
        const response = await axios.put(`/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error("Error al editar usuario:", error);
    }
}

export async function CreateUsers(userData) {
    try{
        const response = await axios.post("/users/", userData);
        return response.data;
    }catch(error) {
        console.error("Error al crear un nuevo usuario",error);
    }
    
}