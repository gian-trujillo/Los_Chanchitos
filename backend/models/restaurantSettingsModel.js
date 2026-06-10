const mongoose = require("mongoose");

const restaurantSettingsSchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 240,
    },
    whatsappPhone: {
      type: String,
      required: true,
      trim: true,
    },
    openingTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    closingTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    lastPickupTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    closedDay: {
      type: String,
      required: true,
      enum: [
        "lunes",
        "martes",
        "miércoles",
        "jueves",
        "viernes",
        "sábado",
        "domingo",
      ],
    },
    estimatedPrepTime: {
      type: Number,
      required: true,
      min: 5,
    },
    forceClosed: {
      type: Boolean,
      default: false,
    },
    pauseOrders: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RestaurantSettings", restaurantSettingsSchema);