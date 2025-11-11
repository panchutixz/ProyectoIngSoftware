import axios from '@services/root.service.js';

export async function registerBicicletas(){
    try{
        const response = await axios.post('/register/bicicletas');
        return response.data;
    }catch(error){
        console.error("Error al registrar la bicicleta:", error);
    }
}

export async function getBicicletas() {
    try{
        const response = await axios.get('/auth/obtener/bicicletas');
        return response.data.message.data;
    }catch(error){
        console.error("Error al obtener las bicicletas:", error);
    }
}

export async function retirarBicicleta(payload){
    try{
        const response = await axios.delete('/retirar/bicicletas', { data: payload });
        return response.data;

    }catch(error){
        console.error("Error al retirar la bicicleta:", error);
    }
}