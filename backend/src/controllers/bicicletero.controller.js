import { AppDataSource } from "../config/configDb.js";
import { createValidation } from "../validations/bicicletero.validation.js";
import Bicicletero from "../entities/bicicletero.entity.js";
import Bicicleta from "../entities/bicicletas.entity.js";
import User from "../entities/user.entity.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

// Crear bicicletero
export async function createBikeRack(req, res) {
    const bikeRackRepository = AppDataSource.getRepository(Bicicletero);
    const { nombre, capacidad, ubicacion, estado } = req.body;

    const { error } = createValidation.validate(req.body);
    if (error) return handleErrorClient(res, 400, { message: error.details[0].message });

    try {
        const existeNombre = await bikeRackRepository.findOne({ where: { nombre } });
        if (existeNombre) {
            return handleErrorClient(res, 404, `Ya existe un bicicletero con el nombre "${nombre}".`);
        }

        const existeUbicacion = await bikeRackRepository.findOne({ where: { ubicacion } });
        if (existeUbicacion) {
            return handleErrorClient(res, 400, { message: `Ya existe un bicicletero registrado en la ubicación "${ubicacion}".` });
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
        const bicicleteros = await bikeRackRepository.find();
        return handleSuccess(res, 200, "Bicicleteros obtenidos correctamente", bicicleteros);
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
    const { nombre, capacidad, ubicacion, estado } = req.body;

    const { error } = createValidation.validate(req.body);
    if (error) return handleErrorClient(res, 400, { message: error.details[0].message });

    try {
        const bicicletero = await bikeRackRepository.findOne({ where: { id_bicicletero: parseInt(id_bicicletero) } });
        if (!bicicletero) {
            return handleErrorClient(res, 404, `No existe un bicicletero con id: ${id_bicicletero}`);
        }

        bicicletero.nombre = nombre;
        bicicletero.capacidad = capacidad;
        bicicletero.ubicacion = ubicacion;
        bicicletero.estado = estado;

        await bikeRackRepository.save(bicicletero);
        return handleSuccess(res, 200, `Bicicletero con id ${id_bicicletero} actualizado correctamente`);
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
    try {
        // Validar autentificación de administrador
        const admin = req.user;
        if (!admin) return handleErrorClient(res, 401, "Usuario no autenticado");

        const adminRol = (admin.rol || admin.role || "").toString().toLowerCase();
        if (adminRol !== "administrador") {
            return handleErrorClient(res, 403, "Solo los administradores pueden asignar guardias");
        }

        const { id_bicicletero, id } = req.body;
        if (!id_bicicletero || !id) {
            return handleErrorClient(res, 400, "Se requiere el id del bicicletero y el id del guardia");
        }

        const bikeRackRepository = AppDataSource.getRepository(Bicicletero);
        const userRepository = AppDataSource.getRepository(User);

        const bicicletero = await bikeRackRepository.findOne({ where: { id_bicicletero: parseInt(id_bicicletero) }, relations: ["usuarios"] });
        if (!bicicletero) {
            return handleErrorClient(res, 404, "Bicicletero no encontrado");
        }

        const guardia = await userRepository.findOne({ where: { id: parseInt(id), rol: "Guardia" }, relations: ["bicicletero"] });
        if (!guardia) {
            return handleErrorClient(res, 404, "Guardia no encontrado o no válido");
        }

        // Verificar si el guardia ya está asignado a este bicicletero
        const guardiaYaAsignado = bicicletero.usuarios.some(u => u.id === guardia.id);
        if (guardiaYaAsignado) {
            return handleErrorClient(res, 400, "Este guardia ya se encuentra asignado al bicicletero");
        }

        // Verificar que el bicicletero no tenga otro guardia asignado
        const guardiaExistente = bicicletero.usuarios.find(u => (u.rol || "").toLowerCase() === "guardia");
        if (guardiaExistente) {
            return handleErrorClient(res, 400, "Este bicicletero ya tiene un guardia asignado");
        }

        // Verificar que el guardia no esté asignado a otro bicicletero
        if ( guardia.bicicletero && guardia.bicicletero.id_bicicletero !== parseInt(id_bicicletero)) {
            return handleErrorClient(res, 400, "Este guardia ya está asignado a otro bicicletero");
        }

        bicicletero.usuarios.push(guardia);
        await bikeRackRepository.save(bicicletero);

        return handleSuccess(res, 200, "Guardia asignado correctamente", bicicletero);
    } catch (error) {
        console.error("Error al asignar guardia:", error);
        return handleErrorServer(res, 500, "Error al asignar guardia", error.message);
    }
}

// Desasignar guardia de bicicletero
export async function desasignarGuardia(req, res) {
    const bikeRackRepository = AppDataSource.getRepository(Bicicletero);

    try {
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