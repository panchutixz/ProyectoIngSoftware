import { EntitySchema, JoinColumn } from "typeorm";

export const Bicicleta = new EntitySchema({
    name: "Bicicleta",
    tableName: "bicicletas",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: "increment",
        },
        marca: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        color: {
            type: "varchar",
            length: 40,
            nullable: false,
        },
        numero_serie: {
            type: "varchar",
            length: 100,
            unique: true,
        },
        descripcion: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        estado: {
            type: "varchar",
            length: 100,
            nullable: false,
        },

        createdAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },

        updateAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: () => "CURRENT_TIMESTAMP",
        },
    },
    relations: {
        users: {
            type: "one-to-one",
            target: "User",
            JoinColumn: {name: "rut_user"},
            eager: true,
            nullable: false,
        },
        bicicletero: {
            type: "one-to-one",
            target: "Bicicletero",
            JoinColumn: {name: "id"},
            eager: true,
            nullable: false,

        }

    },


});

export default Bicicleta;