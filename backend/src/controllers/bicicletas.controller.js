import { AppDataSource } from "../config/configDb.js";
import { registerValidation, reIngresoValidation, retiroValidation } from "../validations/bicicleta.validation.js";
import Bicicleta from "../entities/bicicletas.entity.js";
import User from "../entities/user.entity.js"
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import Bicicletero from "../entities/bicicletero.entity.js";
import { Historial } from "../entities/historial_bicicleta.entity.js";
import { In } from "typeorm";

// registro bicicletas
export async function registerBicycle(req, res){
    const bicycleRepository = AppDataSource.getRepository(Bicicleta);
    const userRepository = AppDataSource.getRepository(User);
    const bicicleteroRepository = AppDataSource.getRepository(Bicicletero);
    const historialRepository = AppDataSource.getRepository(Historial);

    let { marca, color, numero_serie, descripcion, estado, rut, id_bicicletero} = req.body;
    numero_serie = numero_serie ? numero_serie.toString().toUpperCase() : numero_serie;
    const { error } = registerValidation.validate(req.body);
    if(error) return handleErrorClient(res, 400, error.details[0].message);


    if (req.user.rol === "Guardia"){
        const guardiaBicicleteroId = Number(req.user.bicicleteroId || req.user.bicicletero_id);
        const bodyBicicleteroId = Number(id_bicicletero);
        if (!guardiaBicicleteroId || guardiaBicicleteroId !== bodyBicicleteroId){
            return handleErrorClient(res, 403, "No puedes registrar bicicletas en otro bicicletero");
        }
    }

    const usuario = await userRepository.findOne({ where: {rut}});
    if(!usuario){
        return handleErrorClient(res, 404, "No se encontró un usuario con ese RUT");
    }

    const bicicletasUsuario = await bicycleRepository.count(
        {where: 
            { usuario: { rut },
                estado: In(["guardada", "olvidada"])}}); 
    if (bicicletasUsuario >= 2) {
        return handleErrorClient(res, 400, "El usuario ya tiene el máximo de bicicletas permitidas (2)");
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

    const existingBicycle = await bicycleRepository.findOne({
        where: { numero_serie }
    });
    if (existingBicycle){
        return handleErrorClient(res, 400, "Ya existe una bicicleta registrada con ese número de serie");
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

        await userRepository.update(
            { rut: rut },
            { bicicletero_id: id_bicicletero }
        );
          // Crear registro en el historial
        await historialRepository.save({
            usuario,
            bicicletas: newBicycle,
            fecha_ingreso: new Date(),
            fecha_salida: null
        });

        return handleSuccess(res, 200, "Bicicleta registrada correctamente y usuario actualizado");
    } catch (error) {
        console.error("Error al registrar la bicicleta:", error);
        return handleErrorServer(res, 500, "Error al registrar la bicicleta");
    }
}
// reingreso bicicletas
export async function reIngresoBicycle(req, res) {
    const bicycleRepository = AppDataSource.getRepository(Bicicleta);
    const userRepository = AppDataSource.getRepository(User);
    const historialRepository = AppDataSource.getRepository(Historial);

    let { numero_serie, rut, id_bicicletero } = req.body;
    numero_serie = numero_serie ? numero_serie.toString().toUpperCase() : numero_serie;
    const { error } = reIngresoValidation.validate(req.body);

    if(error) return handleErrorClient(res, 400, error.details[0].message);

    if (req.user.rol === "Guardia"){
        const guardiaBicicleteroId = Number(req.user.bicicleteroId || req.user.bicicletero_id);
        const bodyBicicleteroId = Number(id_bicicletero);
        if (!guardiaBicicleteroId || guardiaBicicleteroId !== bodyBicicleteroId){
            return handleErrorClient(res, 403, "No puedes re-ingresar bicicletas en otro bicicletero");
        }
    }

    const bicicleta = await bicycleRepository.findOne({
        where: { numero_serie: In([numero_serie, numero_serie.toLowerCase(), numero_serie.toUpperCase()]) },
        relations: ["usuario", "bicicletero"]
    });

    if (!bicicleta) {
        return handleErrorClient(res, 404, "La bicicleta no está registrada");
    }

    if (bicicleta.estado !== "entregada") {
        return handleErrorClient(res, 400, "La bicicleta no está en estado entregada");
    }
    if (bicicleta.estado === "guardada") {
        return handleErrorClient(res, 400, "La bicicleta ya está guardada");
    }
    const usuario = await userRepository.findOne({ where: { rut } });
    if (!usuario) {
        return handleErrorClient(res, 404, "Usuario no encontrado");
    }

    bicicleta.estado = "guardada";
    bicicleta.usuario = usuario;
    bicicleta.bicicletero = { id_bicicletero };

        try {
        let codigo;
        let existsCodigo = null;

    do {
    const token = Math.floor(1000 + Math.random() * 9000);
    codigo = `${token}`;
    existsCodigo = await bicycleRepository.findOne({ where: { codigo } });
    }   while (existsCodigo);

    //bicicleta trae todo lo de la bici y el .codigo se asigna el nuevo codigo
    bicicleta.codigo = codigo;
    await bicycleRepository.save(bicicleta);
    await historialRepository.save({
        usuario,
        bicicletas: bicicleta,
        fecha_ingreso: new Date(),
        fecha_salida: null
    });

    return handleSuccess(res, 200, "Bicicleta reingresada correctamente");
    }catch (error) {
        console.error("Error al reingresar la bicicleta:", error);
        return handleErrorServer(res, 500, "Error al reingresar la bicicleta");
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
        const bicicletas = await bicycleRepository.find({
            select: {
            usuario: {rut: true},
            bicicletero: {id_bicicletero: true, nombre: true}
        },
        relations: {
            usuario: true,
            bicicletero: true

        }
        });
        return handleSuccess(res, 200, {message: "Bicicletas encontradas", data: bicicletas});
    }

    if (rol === "Guardia") {
        if (!bicicleteroId) {
        return handleErrorClient(res, 400, "Guardia sin bicicletero asignado", []); //cambio aqui
        }

    const bicicletas = await bicycleRepository.find({
        where: { 
            bicicletero: { id_bicicletero: bicicleteroId },
            usuario: { id: req.user.id },
            estado: In(["guardada", "entregada", "olvidada"])
        },
            select: {
                usuario: {
                    rut: true
                },
                bicicletero: {id_bicicletero: true, nombre: true
                }
            },
            relations: {
                usuario: true,
                bicicletero: true
            }
        }
        
    );

        return handleSuccess(res, 200, {message: "Bicicletas encontradas",data: bicicletas});
    }

    return handleErrorClient(res, 403, "Rol no autorizado para ver bicicletas");
    } catch (error) {
    console.error("Error al obtener bicicletas:", error);
    return handleErrorServer(res, 500, "Error al obtener bicicletas");
    }
}

// funcion para que usarios normales vean sus bicicletas
export async function getUserBicycles(req, res) {
    try {
        const bicycleRepository = AppDataSource.getRepository(Bicicleta);
        const userRepository = AppDataSource.getRepository(User);

        const { rut } = req.params;

        const usuario = await userRepository.findOne({ where: { rut } });
        if (!usuario) {
            return handleErrorClient(res, 404, "Usuario no encontrado");
        }

        const bicicletas = await bicycleRepository.find({
            where: { usuario: { id: usuario.id } },
            relations: ["bicicletero"],
        });

        if (bicicletas.length === 0) {
            return handleErrorClient(res, 404, "El usuario no tiene bicicletas registradas");
        }

        const resultado = bicicletas.map((bici) => ({
            marca: bici.marca,
            color: bici.color,
            estado: bici.estado,
            bicicletero: bici.bicicletero?.nombre || "No asignado",
            ubicacion: bici.bicicletero?.ubicacion || "Desconocida",
        }));

        return handleSuccess(res, 200, { message: "Bicicletas del usuario", data: resultado });

    } catch (error) {
        console.error("Error al obtener bicicletas del usuario:", error);
        return handleErrorServer(res, 500, "Error al obtener bicicletas del usuario");
    }
}




//eliminar bicicletas
export async function retirarBicycle(req, res){
    try {
        // El guardia debe estar autenticado y su info viene en req.user (proporcionada por authMiddleware)
        const guardia = req.user;
        if (!guardia) return handleErrorClient(res, 401, "Usuario no autenticado");

        const guardiaRol = (guardia.rol || guardia.role || "").toString().toLowerCase();
        if (guardiaRol!== "guardia") {
            return handleErrorClient(res, 403, "Solo los guardias pueden eliminar bicicletas");
        }

        const { rut, codigo, id_bicicletero } = req.body;
        if (!rut || !codigo || !id_bicicletero) return handleErrorClient(res, 400, "Se requiere el RUT, el código de la bicicleta y el bicicletero");

        const bicycleRepository = AppDataSource.getRepository(Bicicleta);
        const userRepository = AppDataSource.getRepository("User");
        const historialRepository = AppDataSource.getRepository(Historial);

        const { error } = retiroValidation.validate(req.body);
        if(error) return handleErrorClient(res, 400, error.details[0].message);

        // Obtener usuario objetivo
        const usuario = await userRepository.findOne({ where: { rut } });
        if (!usuario) return handleErrorClient(res, 404, "Usuario no encontrado");

        const bicicleta = await bicycleRepository.findOne({
            where: {
                codigo,
                usuario: { rut },
                bicicletero: { id_bicicletero }
                
            },
            relations: ["bicicletero"]
        });

        if (!bicicleta) {
            return handleErrorClient(res, 404, "No se encontró una bicicleta con ese código en el bicicletero indicado");
        }
        if (bicicleta.estado === "entregada") {
            return handleErrorClient(res, 400, "La bicicleta ya está retirada");
        }

        // Comprobar que el guardia y la bici pertenezcan al mismo bicicletero
        const guardiaBicicleteroId = Number(guardia.bicicleteroId || guardia.bicicletero_id);
        const bicicletaBicicleteroId = Number(bicicleta.bicicletero.id_bicicletero);

        if (!guardiaBicicleteroId) {
            return handleErrorClient(res, 400, "Guardia sin bicicletero asignado");
        }
        if (guardiaBicicleteroId !== bicicletaBicicleteroId) {
            return handleErrorClient(res, 403, "No puedes retirar bicicletas de otro bicicletero");
        }
        
        // Buscar el ingreso más reciente sin salida
        let historial = await historialRepository.findOne({
            where: {
                bicicletas: { id: bicicleta.id },
                fecha_salida: null
            }
        });

        // Si existe ingreso sin salida actualizarlo
        if (historial) {
            historial.fecha_salida = new Date();
            await historialRepository.save(historial);
        }
        // Si no existe, crear un registro nuevo (caso excepcional)
        else {
            await historialRepository.save({
                usuario,
                bicicletas: bicicleta,
                fecha_ingreso: null,
                fecha_salida: new Date()
            });
        }
        

        await bicycleRepository.update(
            { id: bicicleta.id },
            {
                estado: "entregada",
                updateAt: new Date()
            }
        );


        return handleSuccess(res, 200, `Se retiró la bicicleta con código ${codigo} del usuario ${rut}`);
    } catch (error) {
        console.error("Error al eliminar bicicletas", error);
        return handleErrorServer(res, 500, "Error al eliminar bicicletas", error.message);
    }
}

    //LOGICA PARA MARCAR BICICLETAS OLVIDADAS
async function marcarBicicletasOlvidadas() {
    const bicycleRepository = AppDataSource.getRepository(Bicicleta);
    const historialRepository = AppDataSource.getRepository(Historial);

    const ahora = new Date();

    const bicicletas = await bicycleRepository.find({ where: { estado: "guardada" } });

    for (const bici of bicicletas) {
        const minutosPasados = (ahora - bici.updateAt) / (1000 * 60);

        if (minutosPasados >= 5) { // puedes bajar el tiempo para pruebas
        let historial = await historialRepository.findOne({
            where: {
            bicicletas: { id: bici.id },
            fecha_salida: null
            }
        });

        if (historial) {
            historial.fecha_salida = ahora;
            await historialRepository.save(historial);
        } else {
            await historialRepository.save({
            usuario: bici.usuario,
            bicicletas: bici,
            fecha_ingreso: null,
            fecha_salida: ahora
            });
        }

        bici.estado = "olvidada";
        bici.updateAt = ahora;
        await bicycleRepository.save(bici);

        console.log(`Bicicleta ${bici.codigo} marcada como olvidada`);
        }
    }
}

    //valdacion de rol para consultar por POSTMAN
export async function marcarOlvidadas(req, res) {
    try {
        const user = req.user;
        const rol = (user?.rol || "").toString().trim().toLowerCase();

        if (rol !== "guardia") {
        return handleErrorClient(res, 403, "No tienes permisos para marcar bicicletas como olvidadas");
        }

        await marcarBicicletasOlvidadas();
        return handleSuccess(res, 200, "Bicicletas olvidadas marcadas correctamente");
    } catch (error) {
        console.error("Error al marcar bicicletas olvidadas:", error);
        return handleErrorServer(res, 500, "Error al marcar bicicletas olvidadas", error.message);
    }
}

    // nodecrone sin validación de rol
export async function marcarOlvidadasCron() {
    try {
        await marcarBicicletasOlvidadas();
    } catch (error) {
        console.error("Error en nodeCrone marcarOlvidadas:", error);
    }
}
