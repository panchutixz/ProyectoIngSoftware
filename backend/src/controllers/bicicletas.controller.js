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
        let codigo;
        let existsCodigo = null;

    do {
    const token = Math.floor(1000 + Math.random() * 9000);
    codigo = `${token}`;
    existsCodigo = await bicycleRepository.findOne({ where: { codigo } });
    }   while (existsCodigo);

        const newBicycle = await bicycleRepository.save({
            codigo,
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

    if (rol === "Administrador") {
        const bicicletas = await bicycleRepository.find();
        return handleSuccess(res, 200, {message: "Bicicletas encontradas", data: bicicletas});
    }

    if (rol === "Guardia") {
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
    try {
        // El guardia debe estar autenticado y su info viene en req.user (proporcionada por authMiddleware)
        const guardia = req.user;
        if (!guardia) return handleErrorClient(res, 401, "Usuario no autenticado");

        // Validar rol de guardia (case-insensitive)
        const guardiaRol = (guardia.rol || guardia.role || "").toString().toLowerCase();
        if (guardiaRol!== "guardia") {
            return handleErrorClient(res, 403, "Solo los guardias pueden eliminar bicicletas");
        }

        const { rut, codigo } = req.body;
        if (!rut || !codigo) return handleErrorClient(res, 400, "Se requiere el RUT del usuario y el código de la bicicleta");

        const bicycleRepository = AppDataSource.getRepository(Bicicleta);
        const userRepository = AppDataSource.getRepository("User");

        // Obtener usuario objetivo
        const usuario = await userRepository.findOne({ where: { rut } });
        if (!usuario) return handleErrorClient(res, 404, "Usuario no encontrado");

        // Comprobar que el guardia y el usuario pertenezcan al mismo bicicletero
        const guardiaBicicleteroId = guardia.bicicleteroId ?? guardia.bicicletero_id ?? null;
        const usuarioBicicleteroId = usuario.bicicletero_id ?? usuario.bicicleteroId ?? null;

        if (!guardiaBicicleteroId) return handleErrorClient(res, 400, "Guardia sin bicicletero asignado");
        if (guardiaBicicleteroId !== usuarioBicicleteroId) {
            return handleErrorClient(res, 403, "No puedes eliminar bicicletas de otro bicicletero");
        }

        // Buscar la bicicleta específica por código y verificar propietario
        const bicicleta = await bicycleRepository.findOne({
            where: {
                codigo,
                usuario: { rut },
                bicicletero: { id: guardiaBicicleteroId }
            }
        });

        if (!bicicleta) {
            return handleErrorClient(res, 404, "No se encontró una bicicleta con ese código para este usuario en este bicicletero");
        }

        // Eliminar la bicicleta específica
        await bicycleRepository.remove(bicicleta);

        return handleSuccess(res, 200, `Se retiró la bicicleta con código ${codigo} del usuario ${rut}`);
    } catch (error) {
        console.error("Error al eliminar bicicletas", error);
        return handleErrorServer(res, 500, "Error al eliminar bicicletas", error.message);
    }
}