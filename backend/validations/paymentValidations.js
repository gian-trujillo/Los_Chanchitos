const { celebrate, Joi, Segments } = require("celebrate");
const { mongoId } = require("./commonSchemas");

const validateCreatePaymentPreference = celebrate({
  [Segments.BODY]: Joi.object({
    orderId: mongoId,
  }),
});

module.exports = {
  validateCreatePaymentPreference,
};