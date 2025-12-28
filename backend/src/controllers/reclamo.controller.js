import { AppDataSource } from "../config/configDb.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { createReclamoValidation, updateReclamoValidation } from "../validations/reclamo.validation.js";
import Reclamo from "../entities/reclamo.entity.js";
import Bicicleta from "../entities/bicicletas.entity.js";
import User from "../entities/user.entity.js";
import { In } from "typeorm";

//crear reclamo
export async function crearReclamo(req, res) {
    const reclamoRepository = AppDataSource.getRepository(Reclamo);
    const bicycleRepository = AppDataSource.getRepository(Bicicleta);
    const userRepository = AppDataSource.getRepository(User);

    try {
        console.log("=== CREAR RECLAMO ===");
        console.log("Body:", req.body);
        console.log("User:", req.user);

        const { error } = createReclamoValidation.validate(req.body, { abortEarly: false });
        if (error) {
            const mensajes = error.details.map((err) => err.message);
            console.error("Error validación:", mensajes);
            return handleErrorClient(res, 400, mensajes);
        }

        const { descripcion, numero_serie_bicicleta } = req.body;
        const { sub: userId, rol } = req.user; 

        //valida el rol autorizado
        const rolesPermitidos = ["estudiante", "académico", "funcionario"];
        const rolUsuario = rol?.toLowerCase() || "";

        if (!rolesPermitidos.includes(rolUsuario)) {
            console.error("Rol no autorizado:", rol);
            return handleErrorClient(res, 403, "Solo estudiantes, académicos o funcionarios pueden crear reclamos.");
        }

        //buscar usuario por id para obtener su rut
        const usuario = await userRepository.findOne({ 
            where: { id: userId },
            select: ["id", "rut", "nombre", "apellido"] 
        });
        
        if (!usuario) {
            console.error("Usuario no encontrado ID:", userId);
            return handleErrorClient(res, 404, "Usuario no encontrado.");
        }

         console.log("Usuario:", usuario.rut);

        //verificar que la bicicleta exista y que pertenezca al usuario
        const bicicleta = await bicycleRepository.findOne({ 
            where: { 
                numero_serie: numero_serie_bicicleta,
                usuario: { rut: usuario.rut } //esto verifica que la bicicleta sea del usuario
            },
        });
        
        if (!bicicleta) {
            console.error("Bicicleta no encontrada o no pertenece al usuario");

            // distingue entre "bicicleta no existe" y "no es tuya"
            const bicicletaExiste = await bicycleRepository.findOne({ 
                where: { numero_serie: numero_serie_bicicleta } 
            });
            
            if (bicicletaExiste) {
                return handleErrorClient(res, 403, "No puedes hacer reclamos de bicicletas que no son de tu propiedad.");
            } else {
                return handleErrorClient(res, 404, "Bicicleta no encontrada.");
            }
        }

        console.log("Bicicleta:", bicicleta.numero_serie);

        // verificar que el usuario no tenga demasiados reclamos abiertos
        const reclamosAbiertos = await reclamoRepository.count({
            where: { 
                rut_user: usuario.rut,
                estado: 'pendiente',
            }
        });

        console.log(`Reclamos abiertos: ${reclamosAbiertos}`);
 
        // limite opcional de reclamos por usuario
        if (reclamosAbiertos >= 20) {
            return handleErrorClient(res, 400, "Has alcanzado el límite máximo de reclamos abiertos.");
        }

        //crear reclamo
        const nuevoReclamo = reclamoRepository.create({
            descripcion,
            rut_user: usuario.rut,
            numero_serie_bicicleta: bicicleta.numero_serie,
            estado: 'pendiente',
        });

        console.log("Creando reclamo con:", nuevoReclamo);

        const reclamoCreado = reclamoRepository.create(nuevoReclamo);
        const reclamoGuardado = await reclamoRepository.save(reclamoCreado);

        console.log("=== RECLAMO CREADO EXITOSAMENTE ===");
        console.log("ID:", reclamoGuardado.id);

        return handleSuccess(res, 201, "Reclamo creado correctamente", reclamoGuardado);
        
    } catch (error) {
        console.error("=== ERROR DETALLADO ===");
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
        
        // errores específicos de TypeORM
        if (error.code) {
            console.error("Code:", error.code);
            console.error("Detail:", error.detail);
            console.error("Table:", error.table);
            console.error("Constraint:", error.constraint);
        }
        
        return handleErrorServer(res, 500, "Error al crear reclamo: " + error.message);
    }
}

// obtener bicicletas del usuario para el dropdown
export async function obtenerBicicletasUsuario(req, res) {
    const bicycleRepository = AppDataSource.getRepository(Bicicleta);

    try {
        console.log("=== DEBUG obtenerBicicletasUsuario ===");
        console.log("req.user:", req.user);
        console.log("Headers:", req.headers);
        
        // Opción A: Intentar obtener userId de diferentes formas
        const userId = req.user?.sub || req.user?.id || req.user?.userId;
        
        // Opción B: Si no hay userId, intentar con RUT desde el token
        const userRut = req.user?.rut;
        
        if (!userId && !userRut) {
            console.error("No se pudo identificar al usuario");
            return handleErrorClient(res, 400, "Usuario no identificado");
        }

        let bicicletas = [];
        
        if (userRut) {
            // Buscar directamente por RUT
            console.log("Buscando bicicletas por RUT:", userRut);
            bicicletas = await bicycleRepository.find({
                where: { 
                    usuario: { rut: userRut },
                    estado: In(["guardada", "olvidada"]),
                },
                select: ["id", "numero_serie", "marca", "modelo", "color", "estado", "fecha_registro"],
                order: { fecha_registro: "DESC" }
            });
        } else if (userId) {
            // Buscar usuario primero, luego sus bicicletas
            const userRepository = AppDataSource.getRepository(User);
            const usuario = await userRepository.findOne({ 
                where: { id: userId },
                select: ["id", "rut"] 
            });
            
            if (usuario) {
                console.log("Buscando bicicletas para usuario ID:", userId, "RUT:", usuario.rut);
                bicicletas = await bicycleRepository.find({
                    where: { 
                        usuario: { rut: usuario.rut },
                        estado: In(["guardada", "olvidada"]),
                    },
                    select: ["id", "numero_serie", "marca", "modelo", "color", "estado", "fecha_registro"],
                    order: { fecha_registro: "DESC" }
                });
            }
        }

        console.log(`Encontradas ${bicicletas.length} bicicleta(s)`);

        return handleSuccess(res, 200, "Bicicletas obtenidas correctamente", bicicletas);
    } catch (error) {
        console.error("Error detallado en obtenerBicicletasUsuario:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        return handleErrorServer(res, 500, "Error al obtener bicicletas del usuario");
    }
}


//obtener todos los reclamos del usuario autenticado
export async function obtenerMisReclamos(req, res) {
    const reclamoRepository = AppDataSource.getRepository(Reclamo);
    const userRepository = AppDataSource.getRepository(User);

    try {
        console.log("Obteniendo reclamos registrados...");

        const { sub: userId, rol } = req.user;
        const rolLowerCase = rol.toLowerCase();

        console.log(`Usuario ID del token: ${userId}, Rol: ${rol}`);

        // obtener usuario por id para saber su rut
        const usuarioActual = await userRepository.findOne({ 
            where: { id: userId }, 
            select: ["id", "rut", "nombre", "apellido"]
        });

        if (!usuarioActual) {
            console.log("Usuario no encontrado en BD");
            return handleErrorClient(res, 404, "Usuario no encontrado.");
        }

        console.log(`Usuario encontrado: ${usuarioActual.nombre} ${usuarioActual.apellido}, RUT: ${usuarioActual.rut}`);

        let reclamos;
        
        // roles que pueden ver TODOS los reclamos
        const rolesVerTodos = ["admin", "administrador", "guardia"];
        
        if (rolesVerTodos.includes(rolLowerCase)) {
            // tanto el admin como el guardia ven todos los reclamos
            reclamos = await reclamoRepository.find({
                relations: ["usuario", "bicicletas"],
                order: { fecha_creacion: "DESC" }
            });
            console.log(`${rol} ve TODOS los reclamos: ${reclamos.length} encontrados`);
        } else {
            // estudiantes, academicos y funcionarios ven solo sus reclamos (buscar por rut)
            console.log(`${rol} busca reclamos con RUT: ${usuarioActual.rut}`);
            reclamos = await reclamoRepository.find({
                where: { rut_user: usuarioActual.rut }, // esto sirve para buscar po rut
                relations: ["usuario", "bicicletas"],
                order: { fecha_creacion: "DESC" }
            });
            console.log(`${rol} ve SUS reclamos: ${reclamos.length} encontrados`);
        }

         // log detallado solo en desarrollo
        if (process.env.NODE_ENV !== 'production' && reclamos.length > 0) {
            console.log(`=== DETALLE DE RECLAMOS ENCONTRADOS ===`);
            reclamos.forEach((r, i) => {
                console.log(`Reclamo ${i+1}:`, {
                    id: r.id,
                    descripcion: r.descripcion.substring(0, 50) + '...',
                    rut_user: r.rut_user,
                    numero_serie_bicicleta: r.numero_serie_bicicleta,
                    fecha_creacion: r.fecha_creacion,
                });
            });
        }

        // debug: ver estructura de cada reclamo
        if (reclamos.length > 0) {
            console.log(`=== DETALLE DE RECLAMOS ENCONTRADOS ===`);
            reclamos.forEach((r, i) => {
                console.log(`Reclamo ${i+1}:`, {
                    id: r.id,
                    descripcion: r.descripcion,
                    rut_user: r.rut_user,
                    numero_serie_bicicleta: r.numero_serie_bicicleta,
                    fecha_creacion: r.fecha_creacion,
                    tieneUsuario: !!r.usuario,
                    usuarioRut: r.usuario?.rut,
                    tieneBicicleta: !!r.bicicletas,
                    bicicletaNumSerie: r.bicicletas?.numero_serie
                });
            });
        } else {
            console.log("No se encontraron reclamos");
        }

        return handleSuccess(res, 200, "Reclamos obtenidos correctamente", reclamos);
    } catch (error) {
        console.error("Error completo al obtener reclamos:", error);
        console.error("Mensaje:", error.message);
        console.error("Stack:", error.stack);
        return handleErrorServer(res, 500, "Error al obtener reclamos");
    }
}

//actualizar reclamo
export async function actualizarReclamo(req, res) {
    const reclamoRepository = AppDataSource.getRepository(Reclamo);
    const userRepository = AppDataSource.getRepository(User);
    const { id } = req.params;
    const { descripcion } = req.body;
    const { sub: userId, rol } = req.user;
    const rolLowerCase = rol.toLowerCase()

    try {
        const { error } = updateReclamoValidation.validate(req.body, { abortEarly: false });
        if (error) {
            const mensajes = error.details.map((err) => err.message);
            return handleErrorClient(res, 400, mensajes);
        }

        // obtener usuario actual para saber su rut
        const usuarioActual = await userRepository.findOne({ 
            where: { id: userId },
            select: ["id", "rut", "nombre", "apellido"]
        });

        if (!usuarioActual) {
            return handleErrorClient(res, 404, "Usuario no encontrado.");
        }

        // buscar reclamo por id
        const reclamo = await reclamoRepository.findOne({
            where: { id },
            relations: ["usuario"],
        });

        if (!reclamo) {
            return handleErrorClient(res, 404, "Reclamo no encontrado.");
        }

        //roles que pueden editar cualquier reclamo
        const rolesEditarTodos = ["admin", "administrador", "guardia"];
        
        if (!rolesEditarTodos.includes(rolLowerCase)) {
            // Estudiantes, académicos y funcionarios solo pueden editar SUS reclamos
            if (reclamo.rut_user !== usuarioActual.rut) {
                return handleErrorClient(res, 403, "No puedes editar reclamos de otro usuario.");
            }
        }

        //actualiza solo si se proporciona nueva descripción
        if (descripcion !== undefined) {
            reclamo.descripcion = descripcion;
        }

        await reclamoRepository.save(reclamo);
        
        console.log(`Reclamo ${id} actualizado por usuario ${usuarioActual.rut}`);

        return handleSuccess(res, 200, "Reclamo actualizado correctamente", reclamo);
    } catch (error) {
        console.error("Error al actualizar reclamo:", error);
        return handleErrorServer(res, 500, "Error al actualizar reclamo");
    }
}


//eliminar reclamo
export async function eliminarReclamo(req, res) {
    const reclamoRepository = AppDataSource.getRepository(Reclamo);
    const userRepository = AppDataSource.getRepository(User);

    try {
        const { id } = req.params;
        const { sub: userId, rol } = req.user;
        const rolLowerCase = rol.toLowerCase();

        // obtener usuario actual para saber su rut
        const usuarioActual = await userRepository.findOne({ 
            where: { id: userId },
            select: ["id", "rut", "nombre", "apellido"] 
        });
        
        if (!usuarioActual) {
            return handleErrorClient(res, 404, "Usuario no encontrado.");
        }

        //busca el reclamo por id
        const reclamo = await reclamoRepository.findOne({
            where: { id },
            relations: ["usuario"]
        });

        if (!reclamo) {
            return handleErrorClient(res, 404, "Reclamo no encontrado.");
        }

        // roles que pueden eliminar cualquier reclamo
        const rolesEliminarTodos = ["admin", "administrador", "guardia"];
        
        if (!rolesEliminarTodos.includes(rolLowerCase)) {
            // estudiantes, academicos y funcionarios solo pueden eliminar SUS reclamos
            if (reclamo.rut_user !== usuarioActual.rut) {
                return handleErrorClient(res, 403, "No tienes permiso para eliminar este reclamo.");
            }
        }

        await reclamoRepository.remove(reclamo);
        
        console.log(`Reclamo ${id} eliminado por usuario ${usuarioActual.rut} (rol: ${rol})`);

        return handleSuccess(res, 200, "Reclamo eliminado correctamente.");
    } catch (error) {
        console.error("Error al eliminar reclamo:", error);
        return handleErrorServer(res, 500, "Error al eliminar reclamo.");
    }
}