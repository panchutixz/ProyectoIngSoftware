"use strict";

import { AppDataSource } from "../config/configDb.js";
import { UserEntity } from "../entities/user.entity.js";
import { registerValidation} from "../validations/usuario.validation.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se recibió ninguna imagen." });
    }

    const userId = req.user?.id || 1; // ajusta según tu auth
    const imageBuffer = req.file.buffer;

    // Carpeta de destino en src/public/uploads
    const uploadDir = path.join(__dirname, "../public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 👇 Nombre único para cada subida
    const fileName = `user_${userId}_${uuidv4()}.jpg`;
    const outputPath = path.join(uploadDir, fileName);

    // Procesa y guarda la imagen
    await sharp(imageBuffer)
      .resize(300, 300)
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    
     // 👉 Actualiza la BD con la nueva ruta
    const userRepository = AppDataSource.getRepository(UserEntity);
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    user.foto_perfil = `/uploads/${fileName}`;
    await userRepository.save(user);

    res.status(200).json({ message: "Imagen actualizada", path: user.foto_perfil });
  } catch (err) {
    console.error("Error al procesar imagen:", err);
    res.status(500).json({ message: "Error al subir imagen", error: err.message });
  }
};


// Obtener todos los usuarios
export async function getUsers(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(UserEntity);
    const users = await userRepository.find();
    res.status(200).json({ message: "Usuarios encontrados", data: users });
  } catch (error) {
    console.error("Error en getUsers():", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

// Obtener un usuario por ID
export async function getUserById(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(UserEntity);
    const { id } = req.params;
    const idNum = parseInt(id, 10);

    if (Number.isNaN(idNum)) {
      return res.status(400).json({ message: "ID de usuario inválido." });
    }

    const user = await userRepository.findOne({ where: { id: idNum } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.status(200).json({ message: "Usuario encontrado", data: user });
  } catch (error) {
    console.error("Error en getUserById():", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

// Crear un nuevo usuario
export async function createUser(req, res) {
  const { error } = registerValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const userRepository = AppDataSource.getRepository(UserEntity);
    const { rut, nombre, apellido, rol , password, email, telefono } = req.body;

    // Validación para ingresar rol como Guardia solamente
    if (rol.toLowerCase() !== "guardia") {
      return res.status(400).json({ message: "El rol solo puede ser 'estudiante', 'funcionario', 'académico' o 'guardia' al momento de crear un usuario." });
    }
  

    // Verificar si el RUT ya existe
    const existingUser = await userRepository.findOne({ where: { rut } });
    if (existingUser) {
      return res.status(400).json({ message: "Ya existe un usuario con este RUT." });
    }
    // Verificar si el correo ya existe
    const existingEmail = await userRepository.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: "Ya existe un usuario con este correo electrónico." });
    }

    // Verificar si el teléfono ya existe
    if (telefono) {
      const existingTelefono = await userRepository.findOne({ where: { telefono } });
      if (existingTelefono) {
        return res.status(400).json({ message: "Ya existe un usuario con este teléfono." });
      }
    }

    // Encriptar la contraseña antes de guardar
    const hashedPassword = await encryptPassword(password);

    const newUser = userRepository.create({
      rut,
      nombre,
      apellido,
      rol,
      password: hashedPassword,
      email,
      telefono
    });

    const savedUser = await userRepository.save(newUser);
    res.status(201).json({ message: "Usuario creado exitosamente.", data: savedUser });
  } catch (error) {
    console.error("Error en añadir nuevo usuario", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}
// Actualizar un usuario por ID
export async function updateUserById(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(UserEntity);
    const { id } = req.params;
    const { nombre, apellido, rol, email, telefono, rut } = req.body;

    const idNum = parseInt(id, 10);
    if (Number.isNaN(idNum)) {
      return res.status(400).json({ message: "ID de usuario inválido." });
    }

    const user = await userRepository.findOne({ where: { id: idNum } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Validar rol
    const rolesValidos = ["Estudiante", "Funcionario", "Académico", "Guardia", "Administrador"];
    if (rol && !rolesValidos.map(r => r.toLowerCase()).includes(rol.toLowerCase())) {
      return res.status(400).json({ message: `Rol inválido. Solo se permiten: ${rolesValidos.join(", ")}.` });
    }

    // Validar que el nuevo RUT no esté ocupado por otro usuario
    if (rut && rut !== user.rut) {
      const existingRut = await userRepository.findOne({ where: { rut } });
      if (existingRut) {
        return res.status(400).json({ message: "Ya existe un usuario con este RUT." });
      }
      user.rut = rut;
    }

    // Validar que el nuevo email no esté ocupado por otro usuario
    if (email && email !== user.email) {
      const existingEmail = await userRepository.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ message: "Ya existe un usuario con este correo electrónico." });
      }
      user.email = email;
    }

    // Validar que el nuevo teléfono no esté ocupado por otro usuario
    if (telefono && telefono !== user.telefono) {
      const existingTelefono = await userRepository.findOne({ where: { telefono } });
      if (existingTelefono) {
        return res.status(400).json({ message: "Ya existe un usuario con este teléfono." });
      }
      user.telefono = telefono;
    }

    // Actualizar otros campos
    user.nombre = nombre ?? user.nombre;
    user.apellido = apellido ?? user.apellido;
    user.rol = rol ?? user.rol;

    await userRepository.save(user);

    res.status(200).json({ message: "Usuario actualizado exitosamente.", data: user });
  } catch (error) {
    console.error("Error en updateUserById():", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}


// Eliminar un usuario por ID
export async function deleteUserById(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(UserEntity);
    const { id } = req.params;

    const idNum = parseInt(id, 10);
    if (Number.isNaN(idNum)) {
      return res.status(400).json({ message: "ID de usuario inválido." });
    }

    const user = await userRepository.findOne({ where: { id: idNum } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    await userRepository.remove(user);

    res.status(200).json({ message: "Usuario eliminado exitosamente." });
  } catch (error) {
    console.error("Error en deleteUserById():", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}
