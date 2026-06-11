const { celebrate, Joi, Segments } = require("celebrate");
const { timeString } = require("./commonSchemas");

const validateUpdateSettings = celebrate({
  [Segments.BODY]: Joi.object({
    _id: Joi.string().optional(),
    restaurantName: Joi.string().trim().max(80),
    address: Joi.string().trim().max(240),
    whatsappPhone: Joi.string().trim().pattern(/^\d{10,15}$/),
    openingTime: timeString,
    closingTime: timeString,
    lastPickupTime: timeString,
    closedDay: Joi.string().valid(
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
      "domingo"
    ),
    estimatedPrepTime: Joi.number().min(5).max(240),
    forceClosed: Joi.boolean(),
    pauseOrders: Joi.boolean(),
    createdAt: Joi.string().optional(),
    updatedAt: Joi.string().optional(),
    __v: Joi.number().optional(),
  }).min(1),
});

module.exports = {
  validateUpdateSettings,
};