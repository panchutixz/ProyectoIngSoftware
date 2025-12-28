import { AppDataSource } from "../config/configDb.js";
import { registerValidation, reIngresoValidation, retiroValidation, eliminateValidation, editarBicycleValidation } from "../validations/bicicleta.validation.js";
import Bicicleta from "../entities/bicicletas.entity.js";
import User from "../entities/user.entity.js"
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import Bicicletero from "../entities/bicicletero.entity.js";
import { Historial } from "../entities/historial_bicicleta.entity.js";
import HistorialBicicletero from "../entities/historial_bicicletero.entity.js";
import { In } from "typeorm";

// registro bicicletas
export async function registerBicycle(req, res) {
    const bicycleRepository = AppDataSource.getRepository(Bicicleta);
    const userRepository = AppDataSource.getRepository(User);
    const bicicleteroRepository = AppDataSource.getRepository(Bicicletero);
    const historialRepository = AppDataSource.getRepository(Historial);

    let { marca, color, numero_serie, descripcion, estado, rut, id_bicicletero } = req.body;
    numero_serie = numero_serie ? numero_serie.toString().toUpperCase() : numero_serie;
    const { error } = registerValidation.validate(req.body);
    if (error) return handleErrorClient(res, 400, error.details[0].message);


    if (req.user.rol === "Guardia") {
        const guardiaBicicleteroId = Number(req.user.bicicleteroId || req.user.bicicletero_id);
        const bodyBicicleteroId = Number(id_bicicletero);
        if (!guardiaBicicleteroId || guardiaBicicleteroId !== bodyBicicleteroId) {
            return handleErrorClient(res, 403, "No puedes registrar bicicletas en otro bicicletero");
        }
    }

    // Buscar bicicletero
    const bicicleteroBusqueda = await bicicleteroRepository.findOne({ where: { id_bicicletero } });
    if (!bicicleteroBusqueda) {
        return handleErrorClient(res, 400, "No existe el bicicletero");
    }

    if (bicicleteroBusqueda.estado !== "Abierto") {
        return handleErrorClient(res, 403, "El bicicletero no está habilitado para registrar bicicletas");
    }

    // Validar capacidad
    const bicicletasEnBicicletero = await bicycleRepository.count({
        where: { bicicletero: { id_bicicletero }, estado: "guardada" }
    });
    if (bicicletasEnBicicletero >= bicicleteroBusqueda.capacidad) {
        return handleErrorClient(res, 403, "El bicicletero está lleno");
    }

    const usuario = await userRepository.findOne({ where: { rut } });
    if (!usuario) {
        return handleErrorClient(res, 404, "No se encontró un usuario con ese RUT");
    }

    const bicicletasUsuario = await bicycleRepository.count(
        {
            where:
            {
                usuario: { rut },
                estado: In(["guardada", "olvidada"])
            }
        });
    if (bicicletasUsuario >= 2) {
        return handleErrorClient(res, 400, "El usuario ya tiene el máximo de bicicletas permitidas (2)");
    }

    if (!id_bicicletero) {
        return handleErrorClient(res, 404, "No se encontró un bicicletero asociado a este ID");
    }
    const bicicletero = await bicicleteroRepository.findOne({ where: { id_bicicletero } });
    if (!bicicletero) {
        return handleErrorClient(res, 404, "No se encontró un bicicletero con ese ID");
    }

    const existingBicycle = await bicycleRepository.findOne({
        where: { numero_serie }
    });
    if (existingBicycle) {
        return handleErrorClient(res, 400, "Ya existe una bicicleta registrada con ese número de serie");
    }

    try {
        let codigo;
        let existsCodigo = null;

        do {
            const token = Math.floor(1000 + Math.random() * 9000);
            codigo = `${token}`;
            existsCodigo = await bicycleRepository.findOne({ where: { codigo } });
        } while (existsCodigo);

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

        const historialPropioRepo = AppDataSource.getRepository(HistorialBicicletero);
        await historialPropioRepo.save({
            accion: "Ingreso",
            fecha: new Date(),
            bicicletero: bicicletero,
            usuario: usuario,
            bicicleta: newBicycle,
            marca_bici: newBicycle.marca,
            color_bici: newBicycle.color,
            serie_bici: newBicycle.numero_serie
        });

        return handleSuccess(res, 200, "Bicicleta registrada correctamente y usuario actualizado");
    } catch (error) {
        console.error("Error al registrar la bicicleta:", error);
        return handleErrorServer(res, 500, "Error al registrar la bicicleta");
    }
}

export async function reIngresoBicycle(req, res) {
    const bicycleRepository = AppDataSource.getRepository(Bicicleta);
    const userRepository = AppDataSource.getRepository(User);
    const historialRepository = AppDataSource.getRepository(Historial);
    const bicicleteroRepository = AppDataSource.getRepository(Bicicletero);
    const bicicleteroRepo = AppDataSource.getRepository(Bicicletero);

    let { numero_serie, rut, id_bicicletero } = req.body;
    numero_serie = numero_serie ? numero_serie.toString().toUpperCase() : numero_serie;
    const { error } = reIngresoValidation.validate(req.body);

    if (error) return handleErrorClient(res, 400, error.details[0].message);

    if (req.user.rol === "Guardia") {
        const guardiaBicicleteroId = Number(req.user.bicicleteroId || req.user.bicicletero_id);
        const bodyBicicleteroId = Number(id_bicicletero);
        if (!guardiaBicicleteroId || guardiaBicicleteroId !== bodyBicicleteroId) {
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

    const bicicleteroBusqueda = await bicicleteroRepository.findOne({ where: { id_bicicletero } });
    if (!bicicleteroBusqueda) {
        return handleErrorClient(res, 400, "No existe el bicicletero");
    }

    const bicicletasEnBicicletero = await bicycleRepository.count({
        where: { bicicletero: { id_bicicletero }, estado: "guardada" }
    });
    if (bicicletasEnBicicletero >= bicicleteroBusqueda.capacidad) {
        return handleErrorClient(res, 403, "El bicicletero esta lleno, no se puede re-ingresar la bicicleta");
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
        } while (existsCodigo);

        const bicicleteroObj = await bicicleteroRepo.findOne({ where: { id_bicicletero: Number(id_bicicletero) } });
        //bicicleta trae todo lo de la bici y el .codigo se asigna el nuevo codigo
        bicicleta.codigo = codigo;
        await bicycleRepository.save(bicicleta);
        await historialRepository.save({
            usuario,
            bicicletas: bicicleta,
            fecha_ingreso: new Date(),
            fecha_salida: null
        });

        const historialPropioRepo = AppDataSource.getRepository(HistorialBicicletero);
        await historialPropioRepo.save({
            accion: "Re-ingreso",
            fecha: new Date(),
            bicicletero: bicicleteroObj,
            usuario: usuario,
            bicicleta: bicicleta,
            marca_bici: bicicleta.marca,
            color_bici: bicicleta.color,
            serie_bici: bicicleta.numero_serie
        });

        return handleSuccess(res, 200, "Bicicleta reingresada correctamente");
    } catch (error) {
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
                    usuario: { rut: true },
                    bicicletero: { id_bicicletero: true, nombre: true }
                },
                relations: {
                    usuario: true,
                    bicicletero: true

                }
            });
            return handleSuccess(res, 200, { message: "Bicicletas encontradas", data: bicicletas });
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
                    bicicletero: {
                        id_bicicletero: true, nombre: true
                    }
                },
                relations: {
                    usuario: true,
                    bicicletero: true
                }
            }

            );

            return handleSuccess(res, 200, { message: "Bicicletas encontradas", data: bicicletas });
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
            numero_serie: bici.numero_serie,
            codigo: bici.codigo,
            descripcion: bici.descripcion,
            telefono: bici.telefono,
            usuario: { rut: usuario.rut },
            bicicletero: {
                id_bicicletero: bici.bicicletero?.id_bicicletero,
                nombre: bici.bicicletero?.nombre,
                ubicacion: bici.bicicletero?.ubicacion
            },
        }));
        console.log("Resultado bicicletas usuario:", resultado);
        return handleSuccess(res, 200, { message: "Bicicletas del usuario", data: resultado });

    } catch (error) {
        console.error("Error al obtener bicicletas del usuario:", error);
        return handleErrorServer(res, 500, "Error al obtener bicicletas del usuario");
    }
}

//retirar bicicletas
export async function retirarBicycle(req, res) {
    try {
        // El guardia debe estar autenticado y su info viene en req.user (proporcionada por authMiddleware)
        const guardia = req.user;
        if (!guardia) return handleErrorClient(res, 401, "Usuario no autenticado");

        const guardiaRol = (guardia.rol || guardia.role || "").toString().toLowerCase();
        if (guardiaRol !== "guardia") {
            return handleErrorClient(res, 403, "Solo los guardias pueden eliminar bicicletas");
        }

        const { rut, codigo, id_bicicletero } = req.body;
        if (!rut || !codigo || !id_bicicletero) return handleErrorClient(res, 400, "Se requiere el RUT, el código de la bicicleta y el bicicletero");

        const bicycleRepository = AppDataSource.getRepository(Bicicleta);
        const userRepository = AppDataSource.getRepository("User");
        const historialRepository = AppDataSource.getRepository(Historial);
        const bicicleteroRepository = AppDataSource.getRepository(Bicicletero);
        const historialBicicleteroRepo = AppDataSource.getRepository(HistorialBicicletero);

        const { error } = retiroValidation.validate(req.body);
        if (error) return handleErrorClient(res, 400, error.details[0].message);

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

        await historialBicicleteroRepo.save({
            accion: "Retiro",
            fecha: new Date(),
            bicicletero: bicicleta.bicicletero,
            usuario: usuario,
            bicicleta: bicicleta,
            marca_bici: bicicleta.marca,
            color_bici: bicicleta.color,
            serie_bici: bicicleta.numero_serie
        });


        return handleSuccess(res, 200, `Se retiró la bicicleta con código ${codigo} del usuario ${rut}`);
    } catch (error) {
        console.error("Error al eliminar bicicletas", error);
        return handleErrorServer(res, 500, "Error al eliminar bicicletas", error.message);
    }
}

//eliminar bici
export async function eliminarBicycle(req, res) {
    try {
        const guardia = req.user;
        if (!guardia) return handleErrorClient(res, 401, "Usuario no autenticado");

        const guardiaRol = (guardia.rol || guardia.role || "").toString().toLowerCase();
        if (guardiaRol !== "guardia") {
            return handleErrorClient(res, 403, "Solo los guardias pueden eliminar bicicletas");
        }

        const { rut, codigo, id_bicicletero } = req.body;
        if (!rut || !codigo || !id_bicicletero) {
            return handleErrorClient(res, 400, "Se requiere el RUT, el código de la bicicleta y el bicicletero");
        }

        const bicycleRepository = AppDataSource.getRepository(Bicicleta);
        const userRepository = AppDataSource.getRepository("User");

        const { error } = eliminateValidation.validate(req.body);
        if (error) return handleErrorClient(res, 400, error.details[0].message);

        const usuario = await userRepository.findOne({ where: { rut } });
        if (!usuario) return handleErrorClient(res, 404, "Usuario no encontrado");

        const bicicleta = await bicycleRepository.findOne({
            where: { codigo, usuario: { rut }, bicicletero: { id_bicicletero } },
            relations: ["bicicletero"]
        });
        if (!bicicleta) return handleErrorClient(res, 404, "Bicicleta no encontrada");

        await bicycleRepository.remove(bicicleta);

        return handleSuccess(res, 200, `Se eliminó la bicicleta con código ${codigo} del usuario ${rut}, historial conservado`);
    } catch (error) {
        console.error("Error al eliminar bicicleta", error);
        return handleErrorServer(res, 500, "Error al eliminar bicicleta", error.message);
    }
}

//editar bicic//
export async function editarBicycle(req, res) {
    try {
        const guardia = req.user;
        if (!guardia) {
            return handleErrorClient(res, 401, "Usuario no autenticado");
        }

        const guardiaRol = (guardia.rol || guardia.role || "").toString().toLowerCase();
        if (guardiaRol !== "guardia") {
            return handleErrorClient(res, 403, "Solo los guardias pueden editar información de bicicletas");
        }

        // Verificación obligatoria
        const { rut, codigo, id_bicicletero, numero_serie, descripcion } = req.body;
        if (!rut || !codigo || !id_bicicletero || !numero_serie) {
            return handleErrorClient(res, 400, "Se requiere RUT, código, bicicletero y el nuevo número de serie.")
        }

        const bicycleRepository = AppDataSource.getRepository(Bicicleta);
        const userRepository = AppDataSource.getRepository("User");

        // Buscar usuario
        const usuario = await userRepository.findOne({ where: { rut } });
        if (!usuario) {
            return handleErrorClient(res, 404, "Usuario no encontrado")
        }

        // Buscar bicicleta con rut, código y bicicletero
        const bicicleta = await bicycleRepository.findOne({
            where: { codigo, usuario: { rut }, bicicletero: { id_bicicletero } },
            relations: ["bicicletero"]
        });
        if (!bicicleta) {
            return handleErrorClient(res, 404, "Bicicleta no encontrada")
        }

        // Actualizar solo el número de serie
        bicicleta.numero_serie = numero_serie;
        bicicleta.descripcion = descripcion;
        bicicleta.updateAt = new Date();

        await bicycleRepository.save(bicicleta);

        return handleSuccess(res, 200, `Número de serie actualizado para la bicicleta con código ${codigo}.`, bicicleta)
    } catch (error) {
        console.error("Error al editar bicicleta: ", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
}


//LOGICA PARA MARCAR BICICLETAS OLVIDADAS
async function marcarBicicletasOlvidadas() {
    const bicycleRepository = AppDataSource.getRepository(Bicicleta);
    const historialRepository = AppDataSource.getRepository(Historial);
    const historialPropioRepo = AppDataSource.getRepository(HistorialBicicletero);

    const ahora = new Date();

    const bicicletas = await bicycleRepository.find({
        where: { estado: "guardada" },
        relations: ["bicicletero", "usuario"]
    });

    for (const bici of bicicletas) {
        const minutosPasados = (ahora - bici.updateAt) / (1000 * 60);
        for (const bici of bicicletas) {
            const minutosPasados = (ahora - bici.updateAt) / (1000 * 60);

            if (minutosPasados >= 2) { // puedes bajar el tiempo para pruebas
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

                await historialPropioRepo.save({
                    accion: "Marcada Olvidada",
                    fecha: ahora,
                    bicicletero: bici.bicicletero,
                    usuario: bici.usuario,
                    bicicleta: bici,
                    marca_bici: bici.marca,
                    color_bici: bici.color,
                    serie_bici: bici.numero_serie
                });

                console.log(`Bicicleta ${bici.codigo} marcada como olvidada.`);
            }
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
