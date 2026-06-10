const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    unitLabel: {
      type: String,
      required: true,
      trim: true,
    },
    displayUnit: {
      type: String,
      required: true,
      trim: true,
    },
    storedUnit: {
      type: String,
      required: true,
      enum: ["halfUnits", "grams", "units"],
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      default: "",
      maxlength: 240,
    },
    isTracked: {
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

module.exports = mongoose.model("InventoryItem", inventoryItemSchema);