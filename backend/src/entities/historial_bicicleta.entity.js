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
            default: () => "CURRENT_TIMESTAMP",
        },
        fecha_salida: {
            type: "timestamp",
            nullable: true,
            default: null
        },
    },
    relations: {
        usuario: {
            type: "many-to-one",
            target: "User",
            joinColumn: { 
                name: "rut_user",
                referencedColumnName: "rut"
            },
            eager: true, 
        },
        bicicletas: {
            type: "many-to-one",
            target: "Bicicleta",
            joinColumn: {
                name: "numero_serie_bicicleta",
                referencedColumnName: "numero_serie"
            },
            eager: true,
            nullable: true,
        },
    },
});

export default Historial;
//aasas