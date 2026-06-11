const { Joi } = require("celebrate");

const mongoIdOrSlug = Joi.string()
  .trim()
  .required()
  .messages({
    "string.empty": "El identificador es requerido.",
  });

const mongoId = Joi.string()
  .hex()
  .length(24)
  .required()
  .messages({
    "string.hex": "ID inválido.",
    "string.length": "ID inválido.",
  });

const imagePath = Joi.string()
  .trim()
  .allow("")
  .max(500);

const timeString = Joi.string()
  .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
  .messages({
    "string.pattern.base": "La hora debe tener formato HH:mm.",
  });

module.exports = {
  mongoIdOrSlug,
  mongoId,
  imagePath,
  timeString,
};