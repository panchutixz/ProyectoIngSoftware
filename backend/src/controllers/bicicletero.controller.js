import { AppDataSource } from "../config/configDb.js";
import { createValidation } from "../validations/bicicletero.validation.js";
import Bicicletero from "../entities/bicicletero.entity.js";
import Bicicleta from "../entities/bicicletas.entity.js";
import User from "../entities/user.entity.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import  HistorialBicicletero  from "../entities/historial_bicicletero.entity.js";
import { ILike, Not } from "typeorm";

// Crear bicicletero
export async function createBikeRack(req, res) {
    const bikeRackRepository = AppDataSource.getRepository(Bicicletero);
    let { nombre, capacidad, ubicacion, estado } = req.body;
    // Validar autentificación de administrador
    const admin = req.user;

    if (!admin) return handleErrorClient(res, 401, "Usuario no autenticado");

    const adminRol = (admin.rol || admin.role || "").toString().toLowerCase();
    if (!admin) {
        return res.status(401).json({
            message: "Usuario no autenticado",
        });
    }
    if (adminRol !== "administrador") {
        return handleErrorClient(res, 403, "Solo los administradores pueden crear bicicleteros");
    }

    const { error } = createValidation.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
        });
    }
    try {
        nombre = nombre.trim();
        const existeNombre = await bikeRackRepository.findOne({ where: { nombre: ILike(nombre) } });
        if (existeNombre) {
            return res.status(404).json({
                message: `Ya existe un bicicletero con el nombre "${nombre}".`,
            });
        }
        ubicacion = ubicacion.trim();
        const existeUbicacion = await bikeRackRepository.findOne({ where: { ubicacion: ILike(ubicacion) } });

        if (existeUbicacion) {
            return res.status(400).json({
                message: `Ya existe un bicicletero registrado en la ubicación "${ubicacion}".`,
            });
        }
        const newBikeRack = bikeRackRepository.create({ nombre, capacidad, ubicacion, estado });
        await bikeRackRepository.save(newBikeRack);

        return handleSuccess(res, 200, "Bicicletero registrado correctamente");
    } catch (error) {
        console.error("Error al registrar el bicicletero:", error);
        return handleErrorServer(res, 500, "Error al registrar el bicicletero");
    }
}

// Obtener todos
export async function getAllBikeRacks(req, res) {
    const bikeRackRepository = AppDataSource.getRepository(Bicicletero);
    try {
        const bicicleteros = await bikeRackRepository.find({
            relations: ["bicicletas", "usuarios"]
        });

        const dataConCalculos = bicicleteros.map(b => {
            const espaciosOcupados = b.bicicletas
                ? b.bicicletas.filter(bici => {
                    const estadoLimpio = (bici.estado || "").toString().toLowerCase().trim();
                    return estadoLimpio === 'guardada';
                }).length
                : 0;

            return {
                ...b,
                ocupados: espaciosOcupados,
                disponibles: b.capacidad - espaciosOcupados
            };
        });

        return handleSuccess(res, 200, "Bicicleteros obtenidos correctamente", dataConCalculos);
    } catch (error) {
        console.error("Error al obtener bicicleteros:", error);
        return handleErrorServer(res, 500, "Error al obtener bicicleteros");
    }
}

// Obtener por ID
export async function getBikeRackById(req, res) {
    const bikeRackRepository = AppDataSource.getRepository(Bicicletero);
    const { id_bicicletero } = req.query;

    try {
        const bicicletero = await bikeRackRepository.findOne({ where: { id_bicicletero: parseInt(id_bicicletero) }, relations: ["usuarios", "bicicletas"], });
        if (!bicicletero) {
            return handleErrorClient(res, 404, `Bicicletero no encontrado ${id_bicicletero}`);
        }
        return handleSuccess(res, 200, "Bicicletero obtenido correctamente", bicicletero);
    } catch (error) {
        console.error("Error al obtener bicicletero:", error);
        return handleErrorServer(res, 500, "Error al obtener bicicletero");
    }
}

// Actualizar
export async function updateBikeRack(req, res) {
    const bikeRackRepository = AppDataSource.getRepository(Bicicletero);
    const { id_bicicletero } = req.query;
    let { nombre, capacidad, ubicacion, estado } = req.body;

    // Validar autentificación de administrador
    const admin = req.user;
    if (!admin) return handleErrorClient(res, 401, "Usuario no autenticado");

    const adminRol = (admin.rol || admin.role || "").toString().toLowerCase();
    if (adminRol !== "administrador") {
        return handleErrorClient(res, 403, "Solo los administradores pueden actualizar bicicleteros");
    }

    const { error } = createValidation.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
        });
    }

    try {
        const bicicletero = await bikeRackRepository.findOne({
            where: { id_bicicletero: parseInt(id_bicicletero) },
            relations: ["usuarios"]
        });

        if (!bicicletero) {
            return handleErrorClient(res, 404, `No existe un bicicletero con id: ${id_bicicletero}`);
        }

        nombre = nombre.trim();
        const existeNombre = await bikeRackRepository.findOne({
            where: {
                nombre: ILike(nombre),
                id_bicicletero: Not(id_bicicletero)
            }
        });

        if (existeNombre) {
            return res.status(409).json({
                message: `Ya existe otro bicicletero con el nombre "${nombre}".`,
            });
        }

        ubicacion = ubicacion.trim();
        const existeUbicacion = await bikeRackRepository.findOne({
            where: {
                ubicacion: ILike(ubicacion),
                id_bicicletero: Not(id_bicicletero)
            }
        });

        if (existeUbicacion) {
            return res.status(409).json({
                message: `Ya existe otro bicicletero registrado en la ubicación "${ubicacion}".`,
            });
        }

        bicicletero.nombre = nombre;
        bicicletero.capacidad = capacidad;
        bicicletero.ubicacion = ubicacion;
        bicicletero.estado = estado;

        // Desasignar guardia si se cierra el bicicletero
        const nuevoEstado = (estado || "").toString().toLowerCase().trim();

        if (nuevoEstado === 'cerrado') {
            if (bicicletero.usuarios && bicicletero.usuarios.length > 0) {
                bicicletero.usuarios = bicicletero.usuarios.filter(usuario => {
                    const rolUsuario = (usuario.rol || usuario.role || "").toString().toLowerCase();
                    return rolUsuario !== "guardia";
                });
            }
        }

        await bikeRackRepository.save(bicicletero);

        const mensajeExtra = nuevoEstado === 'cerrado' ? " (Guardia desasignado por cierre)" : "";

        return handleSuccess(res, 200, `Bicicletero actualizado correctamente${mensajeExtra}`);
    } catch (error) {
        console.error("Error al actualizar bicicletero:", error);
        return handleErrorServer(res, 500, "Error al actualizar bicicletero");
    }
}

// Eliminar
export async function deleteBikeRack(req, res) {
    const bikeRackRepository = AppDataSource.getRepository(Bicicletero);
    const bicycleRepository = AppDataSource.getRepository(Bicicleta);
    const userRepository = AppDataSource.getRepository(User);
    const { id_bicicletero } = req.query;
    // Validar autentificación de administrador
    const admin = req.user;
    if (!admin) return handleErrorClient(res, 401, "Usuario no autenticado");

    const adminRol = (admin.rol || admin.role || "").toString().toLowerCase();
    if (adminRol !== "administrador") {
        return handleErrorClient(res, 403, "Solo los administradores pueden eliminar bicicleteros");
    }

    try {
        const bicicletero = await bikeRackRepository.findOne({ where: { id_bicicletero: parseInt(id_bicicletero) } });
        if (!bicicletero) {
            return handleErrorClient(res, 404, `No existe un bicicletero con id: ${id_bicicletero}`);
        }

        const bicicletas = await bicycleRepository.count({ where: { bicicletero: { id_bicicletero: parseInt(id_bicicletero) } } });
        if (bicicletas > 0) {
            return handleErrorClient(res, 400, `No es posible eliminar el bicicletero con id: ${id_bicicletero} porque tiene: ${bicicletas} bicicletas registradas.`);
        }

        await userRepository
            .createQueryBuilder()
            .update(User)
            .set({ bicicletero: null })
            .where("bicicletero = :id", { id: parseInt(id_bicicletero) })
            .execute();

        await bikeRackRepository.remove(bicicletero);
        return handleSuccess(res, 200, `Bicicletero con id: ${id_bicicletero} eliminado correctamente`);
    } catch (error) {
        console.error("Error al eliminar bicicletero:", error);
        return handleErrorServer(res, 500, "Error al eliminar bicicletero");
    }
}


// Asignar guardia a un bicicletero
export async function asignarGuardia(req, res) {
    // Validar autentificación de administrador
    const admin = req.user;
    if (!admin) return handleErrorClient(res, 401, "Usuario no autenticado");

    const adminRol = (admin.rol || admin.role || "").toString().toLowerCase();
    if (adminRol !== "administrador") {
        return handleErrorClient(res, 403, "Solo los administradores pueden asignar guardias");
    }

    const { id_bicicletero, id } = req.body;
    console.log("Datos recibidos en backend:", req.body);

    if (!id_bicicletero || !id) {
        return handleErrorClient(res, 400, "Se requiere el id del bicicletero y el id del guardia");
    }

    try {
        const bikeRackRepository = AppDataSource.getRepository(Bicicletero);
        const userRepository = AppDataSource.getRepository(User);

        // Obtener el bicicletero con sus usuarios actuales
        const bicicletero = await bikeRackRepository.findOne({
            where: { id_bicicletero: parseInt(id_bicicletero) },
            relations: ["usuarios"]
        });

        if (!bicicletero) {
            return handleErrorClient(res, 404, "Bicicletero no encontrado");
        }

        // Verificamos si el estado es "cerrado"
        const estadoBicicletero = (bicicletero.estado || "").toString().toLowerCase().trim();
        if (estadoBicicletero === 'cerrado') {
             return handleErrorClient(res, 400, "Este bicicletero no está habilitado");
        }
        // Obtener el guardia nuevo que queremos asignar
        const guardia = await userRepository.findOne({
            where: { id: parseInt(id), rol: "Guardia" },
            relations: ["bicicletero"]
        });

        if (!guardia) {
            return handleErrorClient(res, 404, "Guardia no encontrado o no válido");
        }

        // Verificar si el guardia nuevo ya está asignado a otro bicicletero distinto
        if (guardia.bicicletero && guardia.bicicletero.id_bicicletero !== parseInt(id_bicicletero)) {
            return res.status(400).json({
                message: `Este guardia ya está asignado al bicicletero "${guardia.bicicletero.nombre}".`,
            });
        }

        // Desasignar guardia anterior si existía uno
        bicicletero.usuarios = bicicletero.usuarios.filter(usuario => {
            const rolUsuario = (usuario.rol || usuario.role || "").toString().toLowerCase();
            return rolUsuario !== "guardia";
        });

        bicicletero.usuarios.push(guardia);

        await bikeRackRepository.save(bicicletero);

        return handleSuccess(res, 200, "Guardia asignado correctamente (anterior desvinculado si existía)", bicicletero);
    } catch (error) {
        console.error("Error al asignar guardia:", error);
        return handleErrorServer(res, 500, "Error al asignar guardia", error.message);
    }
}

// Desasignar guardia de bicicletero
export async function desasignarGuardia(req, res) {
    const bikeRackRepository = AppDataSource.getRepository(Bicicletero);
    // Validar autentificación de administrador
    const admin = req.user;
    if (!admin) return handleErrorClient(res, 401, "Usuario no autenticado");

    const adminRol = (admin.rol || admin.role || "").toString().toLowerCase();
    if (adminRol !== "administrador") {
        return handleErrorClient(res, 403, "Solo los administradores pueden desasignar guardias");
    }

    const { id_bicicletero } = req.body;
    if (!id_bicicletero) {
        return handleErrorClient(res, 400, "Se requiere el id del bicicletero");
    }

    try {
        const bicicletero = await bikeRackRepository.findOne({ where: { id_bicicletero: parseInt(id_bicicletero) }, relations: ["usuarios"], });

        if (!bicicletero) {
            return handleErrorClient(res, 404, "Bicicletero no encontrado");
        }

        // Verificar si hay un guardia asignado
        const guardiaExistente = bicicletero.usuarios.find(
            u => (u.rol || "").toLowerCase() === "guardia"
        );

        if (!guardiaExistente) {
            return handleErrorClient(res, 400, "Este bicicletero no tiene un guardia asignado");
        }

        // Desasignar
        bicicletero.usuarios = bicicletero.usuarios.filter(
            u => (u.rol || "").toLowerCase() !== "guardia"
        );
        await bikeRackRepository.save(bicicletero);

        return handleSuccess(res, 200, "Guardia desasignado correctamente", bicicletero);
    } catch (error) {
        console.error("Error al desasignar guardia:", error);
        return handleErrorServer(res, 500, "Error al desasignar guardia", error.message);
    }
}

// Capacidad y espacios en Bicicletero
export async function getCapacity(req, res) {
    try {
        const bicycleRepository = AppDataSource.getRepository(Bicicleta);
        const bicicleteroRepository = AppDataSource.getRepository(Bicicletero);

        const rawId = req.body?.id_bicicletero;
        if (!rawId) return handleErrorClient(res, 400, "Falta id del bicicletero");

        const id = Number(rawId);
        if (!Number.isInteger(id) || id <= 0) return handleErrorClient(res, 400, "ID de bicicletero inválido");

        const bicicletero = await bicicleteroRepository.findOne({
            where: { id_bicicletero: id }
        });
        if (!bicicletero) return handleErrorClient(res, 404, "No se encontró un bicicletero con ese ID");

        const cantidadGuardadas = await bicycleRepository.count({
            where: {
                estado: "guardada",
                bicicletero: { id_bicicletero: bicicletero.id_bicicletero }
            }
        });

        return handleSuccess(res, 200, {
            message: "Capacidad consultada",
            data: {
                bicicleteroId: bicicletero.id_bicicletero,
                guardadas: cantidadGuardadas,
                espaciosDisponibles: bicicletero.capacidad - cantidadGuardadas,
                capacidadTotal: bicicletero.capacidad
            }
        });
    } catch (error) {
        console.error("Error en getCapacity:", error);
        return handleErrorServer(res, 500, "Error al obtener la capacidad");
    }
}

// Obtener todos los guardias
export async function getAllGuardias(req, res) {
    // Validar autentificación de administrador
    const admin = req.user;
    if (!admin) return handleErrorClient(res, 401, "Usuario no autenticado");

    const adminRol = (admin.rol || admin.role || "").toString().toLowerCase();
    if (adminRol !== "administrador") {
        return handleErrorClient(res, 403, "Solo los administradores pueden ver guardias");
    }

    try {
        const userRepository = AppDataSource.getRepository(User);

        // Buscar todos los usuarios con rol Guardia
        const guardias = await userRepository.find({
            where: { rol: "Guardia" },
            select: ["id", "nombre", "apellido", "email"],
            relations: ["bicicletero"],
        });

        return handleSuccess(res, 200, "Guardias obtenidos correctamente", guardias);
    } catch (error) {
        console.error("Error al obtener guardias:", error);
        return handleErrorServer(res, 500, "Error al obtener guardias", error.message);
    }
}

export async function getHistoryByBikeRack(req, res) {
    try {
        const historialRepo = AppDataSource.getRepository(HistorialBicicletero);
        const { id_bicicletero } = req.params;
        const { fecha, rut } = req.query;

        // Query Builder para unir tablas usando los nombres definidos en el Schema
        const query = historialRepo.createQueryBuilder("hb")
            .leftJoinAndSelect("hb.bicicleta", "bici")
            .leftJoinAndSelect("hb.usuario", "usuario")
            .leftJoinAndSelect("hb.bicicletero", "bicicletero")
            .where("bicicletero.id_bicicletero = :id", { id: id_bicicletero });

        if (rut) {
            query.andWhere("usuario.rut LIKE :rut", { rut: `%${rut}%` });
        }

        if (fecha) {
            // Postgres: DATE(hb.fecha). MySQL: DATE(hb.fecha) funciona igual en TypeORM generalmente
            query.andWhere("DATE(hb.fecha) = :fecha", { fecha });
        }

        query.orderBy("hb.fecha", "DESC");

        const historial = await query.getMany();

const data = historial.map(h => {
    // Intenta leer de la relación viva (h.bicicleta)
    // Si es null (se borró), lee las columnas de respaldo (h.marca_bici)

    const marca = h.bicicleta ? h.bicicleta.marca : (h.marca_bici || "Desc.");
    const color = h.bicicleta ? h.bicicleta.color : (h.color_bici || "");
    const serie = h.bicicleta ? h.bicicleta.numero_serie : (h.serie_bici || "N/A");

    const esEventoGuardia = h.accion.toLowerCase().includes("guardia");
    const textoBicicleta = esEventoGuardia ? "-" : `${marca} ${color}`;

    return {
        id: h.id,
        bicicleta: textoBicicleta,
        numero_serie: esEventoGuardia ? "-" : serie,
        usuario: h.usuario ? `${h.usuario.nombre} ${h.usuario.apellido}` : "Usuario Eliminado",
        rut: h.usuario ? h.usuario.rut : "S/R",
        accion: h.accion,
        fecha: h.fecha
    };
});

return handleSuccess(res, 200, "Historial obtenido", data);

    } catch (error) {
        console.error("Error al obtener historial propio:", error);
        return handleErrorServer(res, 500, "Error al obtener el historial");
    }
}