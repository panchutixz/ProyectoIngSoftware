import axios from '@services/root.service.js';

export async function registerBicicletas(data) {
    try {
        const response = await axios.post('auth/register/bicicletas', data);
        return response.data;
    } catch (error) {
        const backendMessage = error.response?.data?.message || 
        "Error en el servidor. Revisa los datos e inténtalo nuevamente.";
        throw new Error(backendMessage);
    }
}

export async function getBicicletas() {
    try{
        const response = await axios.get('/auth/obtener/bicicletas');
        return response.data.message.data;
    }catch(error){
        console.error("Error al obtener las bicicletas:", error);
        const backendMessage = error.response?.data?.message || 
        "Error en el servidor. Revisa los datos e inténtalo nuevamente.";
        throw new Error(backendMessage);
    }
}
export async function reIngresarBicicleta(data){
    try{
        const response = await axios.patch('/auth/reIngreso/bicicletas', data);
        return response.data;
    }catch(error){
        const backendMessage = error.response?.data?.message || 
        "Error en el servidor. Revisa los datos e inténtalo nuevamente.";
        throw new Error(backendMessage);
    }
}

//se le pone entre corchetes porque los datos deben ir dentro de un objeto
export async function retirarBicicleta(data){
    try{
        const response = await axios.delete('/auth/retirar/bicicletas', { data });
        return response.data;
    }catch(error){
        const backendMessage = error.response?.data?.message || 
        "Error en el servidor. Revisa los datos e inténtalo nuevamente.";
        throw new Error(backendMessage);
    }
}