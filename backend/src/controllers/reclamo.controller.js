import { AppDataSource } from "../config/configDb.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { createReclamoValidation, updateReclamoValidation } from "../validations/reclamo.validation.js";
import Reclamo from "../entities/reclamo.entity.js";
import Bicicleta from "../entities/bicicletas.entity.js";
import User from "../entities/user.entity.js";

//crear reclamo
export async function crearReclamo(req, res) {
    const reclamoRepository = AppDataSource.getRepository(Reclamo);
    const bicycleRepository = AppDataSource.getRepository(Bicicleta);
    const userRepository = AppDataSource.getRepository(User);

    try {
        const { error } = createReclamoValidation.validate(req.body, { abortEarly: false });
        if (error) {
            const mensajes = error.details.map((err) => err.message);
            return handleErrorClient(res, 400, mensajes);
        }

        const { descripcion, numero_serie_bicicleta } = req.body;
        const { sub: userId, rol } = req.user; 

        //valida el rol autorizado
        const rolesPermitidos = ["Estudiante", "Académico", "Funcionario"];
        if (!rolesPermitidos.map(r => r.toLowerCase()).includes(rol.toLowerCase())) {
            return handleErrorClient(res, 403, "Solo estudiantes, académicos o funcionarios pueden crear reclamos.");
        }

        //buscar usuario por id para obtener su rut
        const usuario = await userRepository.findOne({ where: { id: userId} });
        if (!usuario) {
            return handleErrorClient(res, 404, "Usuario no encontrado.");
        }

        //verificar que la bicicleta exista
        const bicicleta = await bicycleRepository.findOne({ where: { numero_serie: numero_serie_bicicleta } });
        if (!bicicleta) {
            return handleErrorClient(res, 404, "Bicicleta no encontrada.");
        }

        //crear reclamo
        const nuevoReclamo = reclamoRepository.create({
            descripcion,
            rut_user: usuario.rut,
            numero_serie_bicicleta,
            usuario,
            bicicletas: bicicleta
        });

        await reclamoRepository.save(nuevoReclamo);

        return handleSuccess(res, 200, "Reclamo creado correctamente", nuevoReclamo);
    } catch (error) {
        console.error("Error al crear reclamo:", error);
        return handleErrorServer(res, 500, "Error al crear reclamo");
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
            where: { id: userId } 
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
    const { sub: userId } = req.user;

    try {
        const { error } = updateReclamoValidation.validate(req.body, { abortEarly: false });
        if (error) {
            const mensajes = error.details.map((err) => err.message);
            return handleErrorClient(res, 400, mensajes);
        }

        // obtener usuario actual para saber su rut
        const usuarioActual = await userRepository.findOne({ 
            where: { id: userId } 
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

        // verifica que el reclamo pertenezca al usuario comparando ruts
        if (reclamo.rut_user !== usuarioActual.rut) {
            return handleErrorClient(res, 403, "No puedes editar reclamos de otro usuario.");
        }

        reclamo.descripcion = descripcion ?? reclamo.descripcion;
        await reclamoRepository.save(reclamo);

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
            where: { id: userId } 
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
        
        if (rolesEliminarTodos.includes(rolLowerCase)) {
            // admin y guardia pueden eliminar cualquier reclamo
            console.log(`${rol} elimina reclamo ${id} de cualquier usuario.`);
        } else {
            // estudiantes, academicos y funcionarios solo pueden eliminar SUS reclamos
            if (reclamo.rut_user !== usuarioActual.rut) {
                return handleErrorClient(res, 403, "No tienes permiso para eliminar este reclamo.");
            }
            console.log(`${rol} elimina SU reclamo ${id}`);
        }

        await reclamoRepository.remove(reclamo);

        return handleSuccess(res, 200, "Reclamo eliminado correctamente.");
    } catch (error) {
        console.error("Error al eliminar reclamo:", error);
        return handleErrorServer(res, 500, "Error al eliminar reclamo.");
    }
}