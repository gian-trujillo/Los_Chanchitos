const { celebrate, Joi, Segments } = require("celebrate");

const validateLogin = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
    password: Joi.string().min(6).max(128).required(),
  }),
});

module.exports = {
  validateLogin,
};