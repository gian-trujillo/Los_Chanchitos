const { celebrate, Joi, Segments } = require("celebrate");
const { mongoIdOrSlug, imagePath } = require("./commonSchemas");

const menuOptionSchema = Joi.object({
  id: Joi.string().trim().max(80).required(),
  name: Joi.string().trim().max(80).required(),
  price: Joi.number().min(0).required(),
});

const inventoryUsageSchema = Joi.object({
  inventoryId: Joi.string().trim().max(80).required(),
  amount: Joi.number().min(0).required(),
});

const menuItemSchema = Joi.object({
  _id: Joi.string().optional(),
  id: Joi.string().trim().max(100).required(),
  category: Joi.string()
    .valid(
      "Individuales",
      "Paquetes",
      "Complementos",
      "Bebidas",
      "Ensaladas",
      "Postres"
    )
    .required(),
  name: Joi.string().trim().max(80).required(),
  price: Joi.alternatives().try(
    Joi.number().min(0),
    Joi.string().trim().max(40)
  ).required(),
  image: imagePath.required(),
  imagePublicId: Joi.string().trim().allow("").max(240),
  description: Joi.string().trim().allow("").max(240),
  badge: Joi.string().trim().allow("").max(40),
  options: Joi.array().items(menuOptionSchema).optional(),
  inventoryUsage: Joi.array().items(inventoryUsageSchema).optional(),
  isFeatured: Joi.boolean(),
  isAvailable: Joi.boolean(),
  order: Joi.number().min(0),

  createdAt: Joi.string().optional(),
  updatedAt: Joi.string().optional(),
  __v: Joi.number().optional(),
}).unknown(false);

const partialMenuItemSchema = menuItemSchema.fork(
  ["id", "category", "name", "price", "image"],
  (schema) => schema.optional()
);

const validateCreateMenuItem = celebrate({
  [Segments.BODY]: menuItemSchema,
});

const validateUpdateMenuItem = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: mongoIdOrSlug,
  }),
  [Segments.BODY]: partialMenuItemSchema.min(1),
});

const validateMenuItemId = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: mongoIdOrSlug,
  }),
});

module.exports = {
  validateCreateMenuItem,
  validateUpdateMenuItem,
  validateMenuItemId,
};