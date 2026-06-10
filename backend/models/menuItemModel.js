const mongoose = require("mongoose");

const menuOptionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const inventoryUsageSchema = new mongoose.Schema(
  {
    inventoryId: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const menuItemSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Individuales",
        "Paquetes",
        "Complementos",
        "Bebidas",
        "Ensaladas",
        "Postres",
      ],
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    price: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    imagePublicId: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      maxlength: 240,
    },
    badge: {
      type: String,
      default: "",
      maxlength: 40,
    },
    options: {
      type: [menuOptionSchema],
      default: undefined,
    },
    inventoryUsage: {
      type: [inventoryUsageSchema],
      default: undefined,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);