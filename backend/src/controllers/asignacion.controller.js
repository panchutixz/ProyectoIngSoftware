import { AppDataSource } from "../config/db.js"; // Ajusta tu importación
import { Asignacion } from "../entities/asignacion.entity.js";
import { LessThanOrEqual, MoreThanOrEqual, Between } from "typeorm";

export async function asignarGuardiaConHorario(req, res) {
    try {
        const { id_bicicletero, id_guardia, fecha, hora_inicio, hora_fin } = req.body;
        const asignacionRepo = AppDataSource.getRepository(Asignacion);

        // 1. VALIDACIÓN: ¿El guardia ya tiene turno en OTRO lado a esa hora?
        // (Opcional, pero recomendado)
        
        // 2. VALIDACIÓN: Choque de horarios en el MISMO bicicletero
        // Buscamos asignaciones para ese día y ese bicicletero
        const turnosDelDia = await asignacionRepo.find({
            where: {
                bicicletero: { id_bicicletero: id_bicicletero },
                fecha: fecha
            }
        });

        // Verificamos matemáticamente si se solapan
        const hayConflicto = turnosDelDia.some(turno => {
            // Un turno se solapa si:
            // (NuevoInicio < ViejoFin) Y (NuevoFin > ViejoInicio)
            return (hora_inicio < turno.hora_fin) && (hora_fin > turno.hora_inicio);
        });

        if (hayConflicto) {
            return res.status(400).json({ 
                message: "Conflicto: Ya hay un guardia asignado en ese horario." 
            });
        }

        // 3. Crear la asignación
        const nuevaAsignacion = {
            fecha,
            hora_inicio,
            hora_fin,
            guardia: { id: id_guardia }, // Asumiendo que la PK de User es 'id'
            bicicletero: { id_bicicletero: id_bicicletero }
        };

        await asignacionRepo.save(nuevaAsignacion);

        return res.status(200).json({ message: "Guardia asignado exitosamente" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al asignar guardia" });
    }
}

export async function verHistorial(req, res) {
    const { id_bicicletero } = req.params;
    const asignacionRepo = AppDataSource.getRepository(Asignacion);

    const historial = await asignacionRepo.find({
        where: { bicicletero: { id_bicicletero: id_bicicletero } },
        relations: ["guardia"], // Para traer el nombre del guardia
        order: { fecha: "DESC", hora_inicio: "ASC" }
    });

    res.json(historial);
}