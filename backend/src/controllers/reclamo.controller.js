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

        const { descripcion, id_bicicleta } = req.body;
        const { sub: userId, rol } = req.user; 

        //valida el rol autorizado
        const rolesPermitidos = ["Estudiante", "Académico", "Funcionario"];
        if (!rolesPermitidos.map(r => r.toLowerCase()).includes(rol.toLowerCase())) {
            return handleErrorClient(res, 403, "Solo estudiantes, académicos o funcionarios pueden crear reclamos.");
        }

        //buscar usuario por id 
        const usuario = await userRepository.findOne({ where: { id: userId } });
        if (!usuario) {
            return handleErrorClient(res, 404, "Usuario no encontrado.");
        }

        //verificar que la bicicleta exista
        const bicicleta = await bicycleRepository.findOne({ where: { id: id_bicicleta } });
        if (!bicicleta) {
            return handleErrorClient(res, 404, "Bicicleta no encontrada.");
        }

        //crear reclamo
        const nuevoReclamo = reclamoRepository.create({
            descripcion,
            usuario,
            bicicleta
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

    try {
        const { sub: userId, rol } = req.user; 

        let reclamos;

        if (rol === "Admin") {
            // si es admin, ve todos los reclamos
            reclamos = await reclamoRepository.find({
                relations: ["usuario", "bicicletas"],
                order: { fecha_creacion: "DESC" }
            });
        } else {
            //si es estudiante, academico o funcionario, solo los suyos
            reclamos = await reclamoRepository.find({
                where: { usuario: { id: userId } },
                relations: ["usuario", "bicicletas"],
                order: { fecha_creacion: "DESC" }
            });
        }

        return handleSuccess(res, 200, "Reclamos obtenidos correctamente", reclamos);
    } catch (error) {
        console.error("Error al obtener reclamos:", error);
        return handleErrorServer(res, 500, "Error al obtener reclamos");
    }
}

//actualizar reclamo
export async function actualizarReclamo(req, res) {
    const reclamoRepository = AppDataSource.getRepository(Reclamo);
    const { id } = req.params;
    const { descripcion } = req.body;
    const { sub: userId } = req.user;

    try {
        const { error } = updateReclamoValidation.validate(req.body, { abortEarly: false });
        if (error) {
            const mensajes = error.details.map((err) => err.message);
            return handleErrorClient(res, 400, mensajes);
        }

        const reclamo = await reclamoRepository.findOne({
            where: { id },
            relations: ["usuario"],
        });

        if (!reclamo) {
            return handleErrorClient(res, 404, "Reclamo no encontrado.");
        }

        //solo el dueño del reclamo puede editarlo
        if (reclamo.usuario.id !== userId) {
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

    try {
        const { id } = req.params;
        const { sub: userId, rol } = req.user;

        //busca el reclamo por id
        const reclamo = await reclamoRepository.findOne({
            where: { id },
            relations: ["usuario"]
        });

        if (!reclamo) {
            return handleErrorClient(res, 404, "Reclamo no encontrado.");
        }

        //solo el dueño del reclamo o un administrador pueden eliminarlo
        if (reclamo.usuario.id !== userId && rol.toLowerCase() !== "administrador") {
            return handleErrorClient(res, 403, "No tienes permiso para eliminar este reclamo.");
        }

        await reclamoRepository.remove(reclamo);

        return handleSuccess(res, 200, "Reclamo eliminado correctamente.");
    } catch (error) {
        console.error("Error al eliminar reclamo:", error);
        return handleErrorServer(res, 500, "Error al eliminar reclamo.");
    }
}