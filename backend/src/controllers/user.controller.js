"use strict";

import { AppDataSource } from "../config/configDb.js";
import { UserEntity } from "../entities/user.entity.js";
import { registerValidation} from "../validations/usuario.validation.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";



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

    // Validación para ingresar rol como Estudiante, Funcionario o Académico solamente
    if (rol.toLowerCase() !== "estudiante" && rol.toLowerCase() !== "funcionario" && rol.toLowerCase() !== "académico" && rol.toLowerCase() !== "academico") {
      return res.status(400).json({ message: "El rol solo puede ser 'estudiante', 'funcionario' o 'académico' al momento de crear un usuario." });
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
    const { nombre, apellido, rol, email } = req.body;

    const idNum = parseInt(id, 10);
    if (Number.isNaN(idNum)) {
      return res.status(400).json({ message: "ID de usuario inválido." });
    }

    const user = await userRepository.findOne({ where: { id: idNum } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
// Validar que el nuevo rol sea uno permitido, si se está intentando actualizar
    const rolesValidos = ["Estudiante", "Funcionario", "Académico"];
    if (rol && !rolesValidos.includes(rol.toLowerCase())) {
      return res.status(400).json({ message: `Rol inválido. Solo se permiten: ${rolesValidos.join(", ")}.` });
    }

    user.nombre = nombre ?? user.nombre;
    user.apellido = apellido ?? user.apellido;
    user.rol = rol ?? user.rol;
    user.email = email ?? user.email;

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
