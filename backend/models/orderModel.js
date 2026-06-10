const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      trim: true,
    },
    productMongoId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
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
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    image: {
      type: String,
      default: "",
    },
    selectedOption: {
      id: {
        type: String,
        trim: true,
      },
      name: {
        type: String,
        trim: true,
      },
      price: {
        type: Number,
        min: 0,
      },
    },
    inventoryUsage: {
      type: [
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
      ],
      default: undefined,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "received",
        "confirmed",
        "preparing",
        "ready",
        "completed",
        "cancelled",
      ],
      default: "received",
    },
    statusLabel: {
      type: String,
      default: "Pedido recibido",
    },
    customer: {
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20,
      },
    },
    pickup: {
      type: {
        type: String,
        enum: ["asap", "scheduled"],
        required: true,
      },
      time: {
        type: String,
        default: "",
      },
    },
    paymentMethod: {
      type: String,
      enum: ["pickup", "online"],
      default: "pickup",
    },
    details: {
      type: String,
      default: "",
      maxlength: 500,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator(items) {
          return items.length > 0;
        },
        message: "El pedido debe tener al menos un producto.",
      },
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);