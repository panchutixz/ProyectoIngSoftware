import { AppDataSource } from "../config/configDb.js";
import { registerValidation } from "../validations/bicicleta.validation.js";
import Bicicleta from "../entities/bicicletas.entity.js";
import User, { UserEntity } from "../entities/user.entity.js"
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import Bicicletero from "../entities/bicicletero.entity.js";

// registro bicicletas
export async function registerBicycle(req, res){
    const bicycleRepository = AppDataSource.getRepository(Bicicleta);
    const userRepository = AppDataSource.getRepository(User);
    const bicicleteroRepository = AppDataSource.getRepository(Bicicletero);

    const { marca, color, numero_serie, descripcion, estado, rut, id_bicicletero} = req.body;
    const { error } = registerValidation.validate(req.body);
    if(error) return handleErrorClient(res, 400,{message: error.details[0].message});

    //verficar si el usuario que desea ingresar ya existe

    const usuario = await userRepository.findOne({ where: {rut}});
    if(!usuario){
        return handleErrorClient(res, 404, "No se encontró un usuario con ese RUT");
    }

    if(!id_bicicletero){
        return handleErrorClient(res, 404, "No se encontró un bicicletero asociado a este ID");
    }
    const bicicletero = await bicicleteroRepository.findOne({where: {id_bicicletero}});
    if(!bicicletero){
        return handleErrorClient(res, 404, "No se encontró un bicicletero con ese ID");
    }
    const bicicletasEnBicicletero = await bicycleRepository.count({ where: { bicicletero } });
    if (bicicletasEnBicicletero >= bicicletero.capacidad) {
    return handleErrorClient(res, 400, "El bicicletero está lleno");
    }
    
    //verificar si la bicicleta que se quiere registrar ya se encuentra //FALTARA ENLAZAR CON BICICLETERO//
    const existingBicycle = await bicycleRepository.findOne({
        where: { 
            numero_serie, 
            usuario: {id: usuario.id},
            bicicletero: {id: bicicletero.id}
        
        },
    });

    if(existingBicycle){
    return handleErrorClient(res, 404, "Ya existe una bicicleta registrada con este RUT y número de serie");
    }
    try {
        const newBicycle = await bicycleRepository.save({
            marca,
            color,
            numero_serie,
            descripcion,
            estado,
            usuario,
            bicicletero
        });

        // Actualizar el bicicletero_id del usuario
        await userRepository.update(
            { rut: rut },
            { bicicletero_id: id_bicicletero }
        );

        return handleSuccess(res, 200, "Bicicleta registrada correctamente y usuario actualizado");
    } catch (error) {
        console.error("Error al registrar la bicicleta:", error);
        return handleErrorServer(res, 500, "Error al registrar la bicicleta");
    }
}


//obtener bicicletas
export async function getBicycle(req, res) {
    try {
    const bicycleRepository = AppDataSource.getRepository(Bicicleta);

    if (!req.user) {
        return handleErrorClient(res, 401, "Usuario no autenticado");
    }

    const { rol, bicicleteroId } = req.user;

    if (rol === "administrador") {
        const bicicletas = await bicycleRepository.find();
        return handleSuccess(res, 200, {message: "Bicicletas encontradas", data: bicicletas});
    }

    if (rol === "guardia") {
        if (!bicicleteroId) {
        return handleErrorClient(res, 400, "Guardia sin bicicletero asignado");
        }

    const bicicletas = await bicycleRepository.find({
        where: { bicicletero: { id: bicicleteroId } }
    });

        return handleSuccess(res, 200, {message: "Bicicletas encontradas",data: bicicletas});
    }

    return handleErrorClient(res, 403, "Rol no autorizado para ver bicicletas");
    } catch (error) {
    console.error("Error al obtener bicicletas:", error);
    return handleErrorServer(res, 500, "Error al obtener bicicletas");
    }
}



//eliminar bicicletas
export async function retirarBicycle(req, res){
    try{
        const {rut, guardiaRUT} = req.body;

        const bicycleRepository = AppDataSource.getRepository(Bicicleta);
        const userRepository = AppDataSource.getRepository(User);

        const guardia = await userRepository.findOne({
            where: {rut: guardiaRUT}
        });

        if(!guardia || guardia.rol !== guardia){
            return handleErrorClient(res, 403, "Solo los guardias pueden eliminar bicicletas");
        }
        const usuario = await userRepository.findOne({
            where : {rut},
        });
        if(!usuario){
            return handleErrorClient(res, 404, "Usuario no encontrado");
        }
        if(usuario.bicicletero_id !== guardia.bicicletero_id){
            return handleErrorClient(res, 404, "No puedes eliminar bicicletas de otro bicicletero");
        }

        const bicicletas = await bicycleRepository.find({
            where: {usuario :{rut} }
        });
        if(bicicletas.length === 0){
            return handleErrorClient(res, 404, "El usuario no tiene bicicleta registrada");
        }

        await Promise.all(bicicletas.map(bici => bicycleRepository.remove(bici)));
        return handleSuccess(res, 200, `Se eliminaron ${bicicletas.length} bicicleta(s) del usuario ${rut}.`);
    }catch(error){
        return console.error("Error al eliminar bicicletas", error);
    }
}