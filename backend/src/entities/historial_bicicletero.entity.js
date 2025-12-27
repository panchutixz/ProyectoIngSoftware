import { EntitySchema } from "typeorm";

const HistorialBicicletero = new EntitySchema({
    name: "HistorialBicicletero",
    tableName: "historial_bicicletero_propio",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: "increment",
        },
        accion: {
            type: "varchar",
            length: 50,
            nullable: false,
        },
        fecha: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        },
    },
    relations: {
        bicicletero: {
            type: "many-to-one",
            target: "Bicicletero",
            joinColumn: { name: "id_bicicletero" },
            nullable: false,
            onDelete: "CASCADE" // Si se borra el bicicletero, se borra su historial
        },
        usuario: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "id_usuario" },
            nullable: true,
        },
        bicicleta: {
            type: "many-to-one",
            target: "Bicicleta",
            joinColumn: { name: "id_bicicleta" },
            nullable: true,
            onDelete: "SET NULL" // Si se borra la bici, queda el registro histórico
        },
    },
});

export default HistorialBicicletero;