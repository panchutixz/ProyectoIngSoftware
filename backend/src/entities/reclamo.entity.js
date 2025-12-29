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
        rut_user: {  
            type: "varchar",
            length: 255,
            nullable: false,
        },
        numero_serie_bicicleta: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        estado: {
            type: "varchar",
            length: 50,
            default: "pendiente",
        },
        respuesta: {
          type: "text",
          nullable: true,
        },
        fecha_contestado: {
          type: "timestamp",
          nullable: true,
        },
        contestado_por: {
          type: "varchar",
          length: 255,
          nullable: true, // RUT del guardia/admin que contestó
        },
        fecha_actualizacion: {
          type: "timestamp",
          default: () => "CURRENT_TIMESTAMP",
          onUpdate: () => "CURRENT_TIMESTAMP",
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
            nullable: true, //cambio de false a true//
            onDelete: "SET NULL", //añadido//
        },
    },
});

export default Reclamo;
