const { celebrate, Joi, Segments } = require("celebrate");
const { mongoIdOrSlug } = require("./commonSchemas");

const inventoryItemSchema = Joi.object({
  _id: Joi.string().optional(),
  id: Joi.string().trim().max(100).required(),
  name: Joi.string().trim().max(80).required(),
  unitLabel: Joi.string().trim().max(80).required(),
  displayUnit: Joi.string().trim().max(80).required(),
  storedUnit: Joi.string().valid("halfUnits", "grams", "units").required(),
  quantity: Joi.number().min(0).required(),
  lowStockThreshold: Joi.number().min(0).required(),
  description: Joi.string().trim().allow("").max(240),
  isTracked: Joi.boolean(),
  order: Joi.number().min(0),

  createdAt: Joi.string().optional(),
  updatedAt: Joi.string().optional(),
  __v: Joi.number().optional(),
}).unknown(false);

const partialInventoryItemSchema = inventoryItemSchema.fork(
  ["id", "name", "unitLabel", "displayUnit", "storedUnit", "quantity", "lowStockThreshold"],
  (schema) => schema.optional()
);

const validateCreateInventoryItem = celebrate({
  [Segments.BODY]: inventoryItemSchema,
});

const validateUpdateInventoryItem = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: mongoIdOrSlug,
  }),
  [Segments.BODY]: partialInventoryItemSchema.min(1),
});

const validateInventoryItemId = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: mongoIdOrSlug,
  }),
});

module.exports = {
  validateCreateInventoryItem,
  validateUpdateInventoryItem,
  validateInventoryItemId,
};