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
                password: await encryptPassword("admin123"),
            },
            {
                rut: "98.765.432-1",
                nombre: "Guardia",
                apellido: "Principal",
                email: "guardia@ubiobio.cl",
                rol: "Guardia",
                password: await encryptPassword("guardia123")
            }
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