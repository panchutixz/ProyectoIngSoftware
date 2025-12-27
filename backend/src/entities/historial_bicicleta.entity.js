import { EntitySchema } from "typeorm";

export const Historial = new EntitySchema({
    name: "Historial",
    tableName: "historial_bicicleta",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: "increment",
        },
        fecha_ingreso: {
            type: "timestamp",
            nullable: false,
            default: () => "CURRENT_TIMESTAMP",
        },
        fecha_salida: {
            type: "timestamp",
            nullable: true,
            default: null
        },
    },
    relations: {
        bicicletas: {
            type: "many-to-one",
            target: "Bicicleta",
            joinColumn: { name: "numero_serie_bicicleta" },
            eager: true,
            nullable: true, //cambio de false a true//
            onDelete: "SET NULL", //añadido//
        },
        usuario: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "rut_user" },
            eager: true,
            nullable: false,
        },
    },
});

export default Historial;