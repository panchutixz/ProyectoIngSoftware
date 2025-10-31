import { AppDataSource } from "../config/configDb.js";
import { registerValidation } from "../validations/bicicleta.validation.js";
import Bicicleta from "../entities/bicicletas.entity.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

// registro bicicletas
export async function registerBicycle(req, res){
    const bicycleRepository = AppDataSource.getRepository(Bicicleta);
    const { marca, color, numero_serie, descripcion, estado} = req.body;
    const { error } = registerValidation.validate(req.body);
    if(error) return handleErrorClient(res, 400,{message: error.details[0].message});


    //verificar si la bicicleta que se quiere registrar ya se encuentra
    //const existingBicycle = await bicycleRepository.find({ where: {rut, numero_serie}});
   // if(existingBicycle){
       // return handleErrorClient(res, 404, "Ya existe una bicicleta registrada con este RUT y número de serie");
    //}
    try{
        const newBicycle = await bicycleRepository.save({
            marca,
            color,
            numero_serie,
            descripcion,
            estado
        });

        return handleSuccess(res, 200, "Bicicleta registrada correctamente");

    }catch (error){
        return handleErrorServer(res, 500, "Error al registrar la bicicleta");
    }
}

//login bicicletas
export async function loginBicycle(req, res){
    try{

    }catch{

    }
}

//obtener bicicletas
export async function getBicycle(req, res){
    try{

    }catch{

    }
}