"use strict";
import { EntitySchema } from "typeorm";

export const UserEntity = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    email: {
      type: "varchar",
      length: 255,
      unique: true,
    },
    password: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    apellido: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    rut: {
      type: "varchar",
      length: 255,
      unique: true,
    },

    rol: {
      type: "varchar",
      length: 255,
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
      bicicletas: {
        type: "one-to-many",
        target: "Bicicleta",
        inverseSide: "usuario"
      },
      bicicletero: {
        type: "one-to-one",
        target: "Bicicletero",
        inverseSide: "usuario",
        joinColumn: {name: "bicicletero_id"},
        eager: false,
        nullable: true
      }
    }
});

export default UserEntity;