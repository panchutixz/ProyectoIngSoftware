import axios from '@services/root.service.js';

export async function registerBicicletas(data) {
    try {
        const response = await axios.post('auth/register/bicicletas', data);
        return response.data;
    } catch (error) {
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
export async function reIngresarBicicleta(data){
    try{
        const response = await axios.patch('/auth/reIngreso/bicicletas', data);
        return response.data;
    }catch(error){
        console.error("Error al reingresar la bicicleta:", error);
    }
}

//se le pone entre corchetes porque los datos deben ir dentro de un objeto
export async function retirarBicicleta(data){
    try{
        const response = await axios.delete('/auth/retirar/bicicletas', { data });
        return response.data;
    }catch(error){
        console.error("Error al retirar la bicicleta:", error);
    }
}