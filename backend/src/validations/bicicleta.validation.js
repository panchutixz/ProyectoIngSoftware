"use strict";
import Joi from "joi";

export const registerValidation = Joi.object({
    marca: Joi.string()
    .min(5)
    .max(20)
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
        "string.pattern.base": "La marca de la bicicleta debe tener formato de solo letras",
        "string.min": "La marca de la bicicleta debe tener un mínimo de 5 carácteres",
        "string.max": "La marca de la bicicleta debe tener un máximo de 20 carácteres",
        "string.empty": "La marca de la bicicleta es obligatoria"
    }),

    color: Joi.string()
    .min(4)
    .max(20)
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
        "string.pattern.base": "El color debe tener formato de solo letras",
        "string.min": "El color debe tener un mínimo de 4 caráctres",
        "string.max": "El color debe tener un máximo de 20 carácteres",
        "string.empty": "El color de la bicicleta es obligatorio"
    }),

    numero_serie: Joi.string()
    .min(10)
    .max(20)
    .pattern(/^[A-Za-z0-9]+$/)
    .required()
    .messages({
        "string.pattern.base": "El número de serie de la bicicleta debe contener solo carácteres y números",
        "string.min": "El número de serie debe tener mínimo 10 carácteres",
        "string.max": "El número de serie debe tener máximo 20 carácteres",
        "string.empty": "La marca de bicicleta es obligatoria",
    }),
    
    descripcion: Joi.string()
    .min(20)
    .max(100)
    .pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/)
    .required()
    .messages({
        "string.pattern.base": "La descripción no debe contener números ni carácteres especiales",
        "string.min": "La descripción debe tener una extensión mínima de 20 carácteres",
        "string.max": "La descripción debe tener una extensión máxima de 100 carácteres",
        "string.empty": "La descripción de la bicicleta es obligatoria",

    }),

    estado: Joi.string()
    .min(7)
    .max(10)
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
        "string.pattern.base": "Se debe ingresar estado de la bicicleta",
        "string.min": "La descripción del estado debe tener una extensión mínima de 7 carácteres",
        "string.max": "La descripción debe tener una extensión máxima de 10 carácteres",
        "string.empty": "El estado de la bicicleta es obligatoria",
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
    id_bicicletero: Joi.string()
        .min(1)
        .max(2)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
            "string.pattern.base": "Para registrar su bicicleta debe ingresar el ID del bicicletero",
            "string.empty": "Para completar el registro de su bicicleta el ID es obligatorio",
            "string.min": "El id del bicicletero debe ser <= 1",
            "string.max": "Los id de los bicicleteros no son de 2 digitos"
        }),
})