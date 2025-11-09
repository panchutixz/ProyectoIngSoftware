"use strict";
import Joi from "joi";

export const createValidation = Joi.object({
    nombre: Joi.string()
    .min(4)
    .max(40)
    .pattern(/^(?=.*[A-Za-zÁÉÍÓÚáéíóúÑñ])[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)
    .required()
    .messages({
        "string.min": "El nombre debe tener a lo menos 4 carácteres",
        "string.max": "El nombre no puede tener más de 40 carácteres",
        "string.pattern.base": "El nombre solo puede contener carácteres, números y espacios",
        "string.empty": "Se debe ingresar el nombre del bicicletero"
    }),

    capacidad: Joi.number()
    .integer()
    .min(3)
    .max(500)
    .required()
    .messages({
        "any.required": "Ingresar la capacidad es obligatorio",
        "number.base": "Se debe ingresar obligatoriamente un número entero correspondiente a la capacidad",
        "number.integer": "La capacidad debe ser un número entero",
        "number.min": "La capacidad mínima admitida es de 3 espacios",
        "number.max": "La capacidad máxima admitida es de 500 espacios"
    }),

    ubicacion: Joi.string()
    .min(4)
    .max(255)
    .pattern(/^(?=.*[A-Za-zÁÉÍÓÚáéíóúÑñ])[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/)
    .required()
    .messages({
        "string.min": "La ubicación debe tener como mínimo 4 carácteres",
        "string.max": "La ubicación debe tener como máximo 255 carácteres",
        "string.pattern.base": "La ubicación debe contener al menos una letra y solo puede contener letras, espacios y números",
        "string.empty": "La ubicación es obligatoria",
    }),
    
    estado: Joi.string()
    .valid('abierto', 'cerrado')
    .insensitive()
    .required()
    .messages({
    "any.only": "El estado debe ser 'abierto' o 'cerrado'",
    "string.empty": "El estado es obligatorio",
    }),
})