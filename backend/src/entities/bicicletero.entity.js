import { EntitySchema, JoinColumn } from "typeorm";

export const Bicicletero = new EntitySchema({
    name: "Bicicletero",
    tableName: "bicicletero",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: "increment",
        },
        nombre: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        capacidad: {
            type: "int",
            generated: "increment",
        },
        ubicacion: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        estado: {
            type: "varchar",
            length: 200,
            nullable: false,
        },

        created_at: {
            type: "timestamp",
            createDate: true,
            default: () => "CURRENT_TIMESTAMP",
        },
        updated_at: {
            type: "timestamp",
            updateDate: true,
        default: () => "CURRENT_TIMESTAMP",
        },
    },
    relations: {
        users: {
            type: "one-to-many",
            target: "User",
            // one-to-many shouldn't use JoinColumn and eager loading here may create circular eager loads
            eager: false,
            nullable: false,

        },
        bicicletas:{
            type: "one-to-many",
            target: "Bicicleta",
            // one-to-many shouldn't use JoinColumn and eager loading here may create circular eager loads
            eager: false,
            nullable: false,
        },

    },
});
//ola
export default Bicicletero;