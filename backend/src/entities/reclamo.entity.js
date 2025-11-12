import { EntitySchema } from "typeorm";

const Reclamo = new EntitySchema({
    name: "Reclamo",
    tableName: "reclamos",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: "increment",
        },
        descripcion: {
            type: "text",
            nullable: false,
        },
        fecha_creacion: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
    },
    relations: {
        usuario: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "rut_usuario" },
            eager: true,
        },
        bicicletas: {
            type: "many-to-one",
            target: "Bicicleta",
            joinColumn: { name: "id_bicicleta" },
            eager: true,
        },
    },
});

export default Reclamo;