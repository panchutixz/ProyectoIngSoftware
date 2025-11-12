import { EntitySchema, JoinColumn } from "typeorm";

export const Bicicletero = new EntitySchema({
    name: "Bicicletero",
    tableName: "bicicletero",
    columns: {
        id_bicicletero: {
            primary: true,
            type: "int",
            generated: "increment",
        },
        nombre: {
            type: "varchar",
            length: 255,
            unique: true,
            nullable: false,
        },
        capacidad: {
            type: "int",
            nullable: false,
        },
        ubicacion: {
            type: "varchar",
            length: 255,
            unique: true,
            nullable: false,
        },
        estado: {
            type: "varchar",
            length: 200,
            nullable: false,
        },
        created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        updated_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP"
        }
    },
    relations: {
        user: {
            type: "one-to-one",
            target: "User",
            inverseSide: "bicicletero"
        },
        bicicletas: {
            type: "one-to-many",
            target: "Bicicleta",
            inverseSide: "bicicletero"
        },
        usuarios: {
            type: "one-to-many",
            target: "User",
            inverseSide: "bicicletero"
        },

    },
});
export default Bicicletero;