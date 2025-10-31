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
        usuario: {
            type: "many-to-one",
            target: "User",
            joinColumn: {name: "rut_user"},
            eager: false,
            nullable: false,
        },
        bicicletero: {
            type: "one-to-one",
            target: "Bicicletero",
            joinColumn: {name: "bicicletero_id"},
            eager: false,
            nullable: true, //true por ahora

        }

    },


});

export default Bicicleta;