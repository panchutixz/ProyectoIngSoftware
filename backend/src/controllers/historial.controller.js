import { AppDataSource } from "../config/configDb.js";
import { Historial } from "../entities/historial_bicicleta.entity.js";
import User from "../entities/user.entity.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { historialValidation } from "../validations/historial.validation.js";

const historialRepository = AppDataSource.getRepository(Historial);

// obtener todo el historial de bicicletas
export async function getHistoryByUser(req, res) {
    try {
        const historialRepository = AppDataSource.getRepository(Historial);
        const userRepository = AppDataSource.getRepository(User);

        const { rut } = req.params;

         const { error } = historialValidation.validate({ rut });
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }


        const usuario = await userRepository.findOne({ where: { rut } });

        if (!usuario) {
            return handleErrorClient(res, 404, "Usuario no encontrado");
        }

        const historial = await historialRepository.find({
            where: { usuario: { id: usuario.id } },
            order: { fecha_ingreso: "DESC" }
        });

        if (historial.length === 0) {
            return handleErrorClient(res, 404, "Este usuario no tiene historial registrado");
        }

        return handleSuccess(res, 200, {
            message: "Historial encontrado",
            data: historial
        });

    } catch (error) {
        console.error("Error al obtener historial:", error);
        return handleErrorServer(res, 500, "Error al obtener historial");
    }
}


