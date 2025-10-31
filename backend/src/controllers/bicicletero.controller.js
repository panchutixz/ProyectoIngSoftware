import { AppDataSource } from "../config/configDb.js";
import { createValidation } from "../validations/bicicletero.validation.js";
import Bicicletero from "../entities/bicicletero.entity.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js"

//Crear bicicletero
export async function createBikeRack(req, res){
    const bikeRackRepository = AppDataSource.getRepository(Bicicletero);
    const { nombre, capacidad, ubicacion, estado } = req.body;
    
    // Validación de datos
    const { error } = createValidation.validate(req.body);
    if(error) return handleErrorClient(res, 400,{message: error.details[0].message});

    try {
    //Verficar duplicado por nombre
    const existeNombre = await bikeRackRepository.findOne({ where: {nombre}});
    if(existeNombre){
        return handleErrorClient(res, 404, `Ya existe un bicicletero con el nombre "${nombre}".`);
    }

    //Verificar duplicado por ubicación
    const existeUbicacion = await bikeRackRepository.findOne({ where: { ubicacion }});
    if (existeUbicacion){
        return handleErrorClient(res, 400, { message: `Ya existe un bicicletero registrado en la ubicación "${ubicacion}".`});
    }

    //Guardar nuevo bicicletero
        const newBikeRack = await bikeRackRepository.create({
            nombre,
            capacidad,
            ubicacion,
            estado
        });
        
        await bikeRackRepository.save(newBikeRack);
        
        return handleSuccess(res, 200, "Bicicletero registrado correctamente");

    }catch (error){
        console.error("Error al registrar el bicicletero:", error);
        return handleErrorServer(res, 500, "Error al registrar el bicicletero");
    }
}

//Obtener todos lo bicicleteros
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

//Obtener bicicletero por Id
export async function getBikeRackById(req, res) {
    const bikeRackRepository = AppDataSource.getRepository(Bicicletero);
    const { id } = req.query;

    try {
        const bicicletero = await bikeRackRepository.findOne({ where: { id: parseInt(id) } });
        if (!bicicletero) {
            return handleErrorClient(res, 404, `Bicicletero no encontrado ${id}`);
        }
        return handleSuccess(res, 200, "Bicicletero obtenido correctamente", bicicletero);
    } catch (error) {
        console.error("Error al obtener bicicletero:", error);
    return handleErrorServer(res, 500, "Error al obtener bicicletero");
    }
}

//Eliminar bicicletero
export async function deleteBikeRack(req, res) {
    const bikeRackRepository = AppDataSource.getRepository(Bicicletero);
    const { id } = req.query;

    try {
        const bicicletero = await bikeRackRepository.findOne({ where: { id: parseInt(id) } });
    if (!bicicletero) {
        return handleErrorClient(res, 404, `Bicicletero no encontrado${id}`);
    }

    await bikeRackRepository.remove(bicicletero);
    return handleSuccess(res, 200, `Bicicletero con id ${id} eliminado correctamente`);
    } catch (error) {
        console.error("Error al eliminar bicicletero:", error);
        return handleErrorServer(res, 500, "Error al eliminar bicicletero");
    }
};