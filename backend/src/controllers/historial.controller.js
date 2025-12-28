import { AppDataSource } from "../config/configDb.js";
import Historial from "../entities/historial_bicicleta.entity.js";
import User from "../entities/user.entity.js";
import Bicicleta from "../entities/bicicletas.entity.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { historialValidation } from "../validations/historial.validation.js";

const historialRepository = AppDataSource.getRepository(Historial);

//obtener historial por usuario (rut)
export async function getHistoryByUser(req, res) {
    try {
        const historialRepository = AppDataSource.getRepository(Historial);
        const userRepository = AppDataSource.getRepository(User);

        const { rut } = req.params;

        const { error } = historialValidation.validate({ rut });
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const usuario = await userRepository.findOne({ 
            where: { rut },
            relations: ["historiales"] 
        });

        if (!usuario) {
            return handleErrorClient(res, 404, "Usuario no encontrado");
        }

        const historial = await historialRepository.find({
            where: { usuario: { rut } },
            relations: ["bicicletas", "usuario"],
            order: { fecha_ingreso: "DESC" }
        });

        if (historial.length === 0) {
            return handleErrorClient(res, 404, "Este usuario no tiene historial registrado");
        }

        return handleSuccess(res, 200, "Historial encontrado", historial);

    } catch (error) {
        console.error("Error al obtener historial:", error);
        return handleErrorServer(res, 500, "Error al obtener historial");
    }
}

//obtener todo el historial (para admin y guardia)
export async function getAllHistorial(req, res) {
    try {
        const historialRepository = AppDataSource.getRepository(Historial);
        
        const historial = await historialRepository.find({
            relations: ["bicicletas", "usuario"],
            order: { fecha_ingreso: "DESC" },
            take: 100 // esto limita resultados
        });

        return handleSuccess(res, 200, "Historial obtenido", historial);

    } catch (error) {
        console.error("Error al obtener todo el historial:", error);
        return handleErrorServer(res, 500, "Error al obtener historial");
    }
}


