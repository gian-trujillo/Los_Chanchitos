const { celebrate, Joi, Segments } = require("celebrate");
const { mongoId } = require("./commonSchemas");

const inventoryUsageSchema = Joi.object({
  inventoryId: Joi.string().trim().max(80).required(),
  amount: Joi.number().min(0).required(),
});

const orderItemSchema = Joi.object({
  productId: Joi.string().trim().max(100).required(),
  productMongoId: Joi.alternatives().try(
    mongoId.optional(),
    Joi.valid(null)
  ),
  name: Joi.string().trim().max(120).required(),
  price: Joi.number().min(0).required(),
  quantity: Joi.number().integer().min(1).max(99).required(),
  image: Joi.string().trim().allow("").max(500),
  selectedOption: Joi.object({
    id: Joi.string().trim().max(80).allow(""),
    name: Joi.string().trim().max(80).allow(""),
    price: Joi.number().min(0),
  }).optional(),
  inventoryUsage: Joi.array().items(inventoryUsageSchema).optional(),
});

const validateCreateOrder = celebrate({
  [Segments.BODY]: Joi.object({
    customer: Joi.object({
      name: Joi.string().trim().max(80).required(),
      phone: Joi.string().trim().pattern(/^\d{8,15}$/).required(),
    }).required(),
    pickup: Joi.object({
      type: Joi.string().valid("asap", "scheduled").required(),
      time: Joi.string().trim().allow("").max(5),
    }).required(),
    paymentMethod: Joi.string().valid("pickup", "online").required(),
    details: Joi.string().trim().allow("").max(500),
    items: Joi.array().items(orderItemSchema).min(1).required(),
    total: Joi.number().min(0).required(),
  }),
});

const validateOrderStatusQuery = celebrate({
  [Segments.QUERY]: Joi.object({
    code: Joi.string().trim().uppercase().pattern(/^LC-\d{4}$/).required(),
    phone: Joi.string().trim().pattern(/^\d{8,15}$/).required(),
  }),
});

const validateUpdateOrderStatus = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: mongoId,
  }),
  [Segments.BODY]: Joi.object({
    status: Joi.string()
      .valid("received", "confirmed", "preparing", "ready", "completed", "cancelled")
      .required(),
  }),
});

module.exports = {
  validateCreateOrder,
  validateOrderStatusQuery,
  validateUpdateOrderStatus,
};