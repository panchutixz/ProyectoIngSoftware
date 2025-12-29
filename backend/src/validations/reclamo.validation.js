"use strict";
import Joi from "joi";

export const createReclamoValidation = Joi.object({
    descripcion: Joi.string()
        .min(10)
        .max(500)
        .pattern(/^(?=.*[A-Za-zÁÉÍÓÚáéíóúÑñ])[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,;:()¡!¿?"' ]+$/)
        .required()
        .messages({
            "string.min": "La descripción debe tener al menos 10 caracteres.",
            "string.max": "La descripción no puede superar los 500 caracteres.",
            "string.pattern.base": "La descripción solo puede contener letras, números y signos de puntuación básicos.",
            "string.empty": "La descripción del reclamo es obligatoria."
        }),

    numero_serie_bicicleta: Joi.string()
        .required()
        .messages({
            "string.empty": "El número de serie de la bicicleta es obligatorio.",
            "any.required": "El número de serie de la bicicleta es obligatorio."
        })
});

export const updateReclamoValidation = Joi.object({
    descripcion: Joi.string()
        .min(10)
        .max(500)
        .pattern(/^(?=.*[A-Za-zÁÉÍÓÚáéíóúÑñ])[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,;:()¡!¿?"' ]+$/)
        .optional()
        .messages({
            "string.min": "La descripción debe tener al menos 10 caracteres.",
            "string.max": "La descripción no puede superar los 500 caracteres.",
            "string.pattern.base": "La descripción solo puede contener letras, números y signos de puntuación básicos."
        })
});

export const contestarReclamoValidation = Joi.object({
  respuesta: Joi.string()
    .min(10)
    .max(1000)
    .pattern(/^(?=.*[A-Za-zÁÉÍÓÚáéíóúÑñ])[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,;:()¡!¿?"' ]+$/)
    .required()
    .messages({
      "string.min": "La respuesta debe tener al menos 10 caracteres.",
      "string.max": "La respuesta no puede superar los 1000 caracteres.",
      "string.pattern.base": "La respuesta solo puede contener letras, números y signos de puntuación básicos.",
      "string.empty": "La respuesta es obligatoria."
    }),
});