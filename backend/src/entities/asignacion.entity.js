import { EntitySchema } from "typeorm";

export const Asignacion = new EntitySchema({
    name: "Asignacion",
    tableName: "asignaciones",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: "increment",
        },
        fecha: {
            type: "date",
            nullable: false,
        },
        hora_inicio: {
            type: "time",
            nullable: false,
        },
        hora_fin: {
            type: "time",
            nullable: false,
        },
        // Opcional: Para saber cuándo se creó el turno
        created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        }
    },
    relations: {
        guardia: {
            target: "User", // Asegúrate de que este string coincida con el 'name' de tu esquema de User
            type: "many-to-one",
            joinColumn: { name: "id_usuario" },
            nullable: false
        },
        bicicletero: {
            target: "Bicicletero", // Coincide con el name de tu esquema Bicicletero
            type: "many-to-one",
            joinColumn: { name: "id_bicicletero" },
            nullable: false
        }
    }
});

export default Asignacion;