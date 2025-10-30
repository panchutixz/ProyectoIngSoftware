"use strict";
import Joi from "joi";


const domainEmailValidator = (value, helpers) => {
  if (!value.endsWith("@gmail.com") && !value.endsWith("@gmail.cl")) {
    return helpers.message(
      "El correo electrónico debe finalizar en @gmail.com o @gmail.cl."
    );
  }
  return value;
};


const passwordRegex = /^[a-zA-Z0-9]+$/;


export const registerValidation = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .min(15)
    .max(50)
    .messages({
      "string.email": "El correo electrónico debe ser válido.",
      "string.min": "El correo electrónico debe tener al menos 15 caracteres.",
      "string.max": "El correo electrónico no puede exceder los 50 caracteres.",
      "string.empty": "El correo electrónico es obligatorio.",
    })
    .custom(domainEmailValidator, "Validación de dominio de correo electrónico"),

  password: Joi.string()
    .min(8)
    .max(26)
    .pattern(passwordRegex)
    .required()
    .messages({
      "string.empty": "La contraseña no puede estar vacía.",
      "any.required": "La contraseña es obligatoria.",
      "string.base": "La contraseña debe ser de tipo texto.",
      "string.min": "La contraseña debe tener al menos 8 caracteres.",
      "string.max": "La contraseña debe tener como máximo 26 caracteres.",
      "string.pattern.base": "La contraseña solo puede contener letras y números. No se permiten símbolos especiales.",
    }),
  nombre: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty": "El nombre es obligatorio.",
      "string.min": "El nombre debe tener al menos 3 caracteres.",
      "string.max": "El nombre no puede exceder los 50 caracteres.",
    }),
  apellido: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty": "El apellido es obligatorio.",
      "string.min": "El apellido debe tener al menos 3 caracteres.",
      "string.max": "El apellido no puede exceder los 50 caracteres.",
    }),
  rut: Joi.string()
    .min(9)
    .max(12)
    .pattern(/^\d{1,2}\.\d{3}\.\d{3}-[0-9kK]{1}$/) 
    .required()
    .messages({
      "string.empty": "El RUT es obligatorio.",
      "string.min": "El RUT debe tener al menos 9 caracteres.",
      "string.max": "El RUT no puede exceder los 12 caracteres.",
      "string.pattern.base": "El RUT debe tener formato xx.xxx.xxx-x.",
    }),
  rol: Joi.string()
    .valid("Estudiante", "Funcionario", "Académico")
    .required()
    .messages({
      "any.only": "El rol debe ser Estudiante, Funcionario o Académico.",
      "string.empty": "El rol es obligatorio.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales",
  });


export const loginValidation = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "El correo electrónico debe ser válido.",
      "string.empty": "El correo electrónico es obligatorio.",
    })
    .custom(domainEmailValidator, "Validación de dominio de correo electrónico"),

  password: Joi.string()
    .min(8)
    .max(26)
    .pattern(passwordRegex)
    .required()
    .messages({
      "string.empty": "La contraseña no puede estar vacía.",
      "any.required": "La contraseña es obligatoria.",
      "string.min": "La contraseña debe tener al menos 8 caracteres.",
      "string.max": "La contraseña debe tener como máximo 26 caracteres.",
      "string.pattern.base": "La contraseña solo puede contener letras y números. No se permiten símbolos especiales.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales",
  });