"use strict";
import Joi from "joi";

// validación para consultar historial por rUT
export const historialValidation = Joi.object({
    rut: Joi.string()
        .min(9)
        .max(12)
        .pattern(/^\d{1,2}\.\d{3}\.\d{3}-[0-9kK]{1}$/)
        .required()
        .messages({
            "string.empty": "El RUT es obligatorio.",
            "string.min": "El RUT debe tener al menos 9 caracteres.",
            "string.max": "El RUT no puede exceder los 12 caracteres.",
            "string.pattern.base": "El RUT debe tener el formato xx.xxx.xxx-x.",
        })
});