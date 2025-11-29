"use strict";

import UserEntity from "../entities/user.entity.js";
import { encryptPassword } from "../handlers/bcrypt.helper.js";
import { AppDataSource } from "../config/configDb.js";

export async function createusers(){
    try{
        const userRepository = AppDataSource.getRepository(UserEntity);
        const usersCount = await userRepository.count();

        if(usersCount > 0) return;
        const users = [
            {
                rut: "12.345.678-9",
                nombre: "Administrador",
                apellido: "Sistema",
                email: "admin@ubiobio.cl",
                rol: "Administrador",
                telefono: "+56912345678",
                password: await encryptPassword("admin123"),
            },
            {
                rut: "11.111.111-1",
                nombre: "Guardia",
                apellido: "Principal",
                email: "guardia1@ubiobio.cl",
                rol: "Guardia",
                telefono: "+56987654321",
                password: await encryptPassword("guardia123")
            },
            {
                rut: "22.222.222-2",
                nombre: "Guardia",
                apellido: "Secundario",
                email: "guardia2@ubiobio.cl",
                rol: "Guardia",
                telefono: "+56911223344",
                password: await encryptPassword("guardia123")
            },
            {
                rut: "33.333.333-3",
                nombre: "Guardia",
                apellido: "Terciario",
                email: "guardia3@ubiobio.cl",
                rol: "Guardia",
                telefono: "+56944332211",
                password: await encryptPassword("guardia123")
            },
            {
                rut: "44.444.444-4",
                nombre: "Guardia",
                apellido: "Cuaternario",
                email: "guardia4@ubiobio.cl",
                rol: "Guardia",
                telefono: "+56955667788",
                password: await encryptPassword("guardia123")
            },

        ]

        console.log("Inicializando usuarios por defecto...");
        for(const userData of users){
            const user = userRepository.create(userData);
            await userRepository.save(user);
        }
        console.log("Usuarios por defecto inicializados.");

    }  catch(error){
        console.error("Error al inicializar usuarios por defecto:", error);
        process.exit(1);
    }
}