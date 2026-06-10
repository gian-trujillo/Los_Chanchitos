const Order = require("../models/orderModel");
const InventoryItem = require("../models/inventoryItemModel");

const statusLabels = {
  received: "Pedido recibido",
  confirmed: "Confirmado",
  preparing: "En preparación",
  ready: "Listo para recoger",
  completed: "Completado",
  cancelled: "Cancelado",
};

const generateOrderCode = () => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `LC-${randomNumber}`;
};

const normalizePhone = (phone) => {
  return String(phone).replace(/\D/g, "");
};

const createUniqueOrderCode = async () => {
  let code = generateOrderCode();
  let existingOrder = await Order.findOne({ code });

  while (existingOrder) {
    code = generateOrderCode();
    existingOrder = await Order.findOne({ code });
  }

  return code;
};

const getInventoryUsageTotals = (items) => {
  return items.reduce((usageTotals, item) => {
    if (!item.inventoryUsage || item.inventoryUsage.length === 0) {
      return usageTotals;
    }

    item.inventoryUsage.forEach((usage) => {
      usageTotals[usage.inventoryId] =
        (usageTotals[usage.inventoryId] || 0) + usage.amount * item.quantity;
    });

    return usageTotals;
  }, {});
};

const validateAndReduceInventory = async (items) => {
  const usageTotals = getInventoryUsageTotals(items);
  const inventoryIds = Object.keys(usageTotals);

  if (inventoryIds.length === 0) {
    return;
  }

  const inventoryItems = await InventoryItem.find({
    id: {
      $in: inventoryIds,
    },
  });

  const inventoryMap = inventoryItems.reduce((map, item) => {
    map[item.id] = item;
    return map;
  }, {});

  const missingItem = inventoryIds.find(
    (inventoryId) => !inventoryMap[inventoryId]
  );

  if (missingItem) {
    const error = new Error(`Inventario no encontrado: ${missingItem}`);
    error.statusCode = 400;
    throw error;
  }

  const updatedInventoryItems = [];

  try {
    for (const inventoryId of inventoryIds) {
      const requiredAmount = usageTotals[inventoryId];

      const updatedInventoryItem = await InventoryItem.findOneAndUpdate(
        {
          id: inventoryId,
          quantity: {
            $gte: requiredAmount,
          },
        },
        {
          $inc: {
            quantity: -requiredAmount,
          },
        },
        {
          new: true,
        }
      );

      if (!updatedInventoryItem) {
        const error = new Error(
          `Inventario insuficiente para ${inventoryMap[inventoryId].name}`
        );
        error.statusCode = 409;
        throw error;
      }

      updatedInventoryItems.push({
        inventoryId,
        amount: requiredAmount,
      });
    }
  } catch (error) {
    if (updatedInventoryItems.length > 0) {
      await Promise.all(
        updatedInventoryItems.map((item) =>
          InventoryItem.updateOne(
            { id: item.inventoryId },
            {
              $inc: {
                quantity: item.amount,
              },
            }
          )
        )
      );
    }

    throw error;
  }
};

const restoreInventoryForOrder = async (items) => {
  const usageTotals = getInventoryUsageTotals(items);
  const inventoryIds = Object.keys(usageTotals);

  if (inventoryIds.length === 0) {
    return;
  }

  await Promise.all(
    inventoryIds.map((inventoryId) =>
      InventoryItem.updateOne(
        { id: inventoryId },
        {
          $inc: {
            quantity: usageTotals[inventoryId],
          },
        }
      )
    )
  );
};

const createOrder = async (req, res, next) => {
  try {
    const { customer, pickup, paymentMethod, details, items, total } = req.body;

    if (!customer?.name || !customer?.phone) {
      return res.status(400).send({
        message: "Nombre y teléfono son requeridos.",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).send({
        message: "El pedido debe tener al menos un producto.",
      });
    }

    const code = await createUniqueOrderCode();

    await validateAndReduceInventory(items);

    const order = await Order.create({
        code,
        customer: {
            name: customer.name,
            phone: normalizePhone(customer.phone),
        },
        pickup,
        paymentMethod,
        paymentStatus: paymentMethod === "online" ? "pending" : "not_required",
        paymentPreferenceId: "",
        paymentUrl: "",
        details,
        items,
        total,
        status: "received",
        statusLabel: statusLabels.received,
    });

    const io = req.app.get("io");

    if (io) {
      io.emit("order:created", order);
    }

    return res.status(201).send(order);
  } catch (error) {
    return next(error);
  }
};

const getOrderStatus = async (req, res, next) => {
  try {
    const { code, phone } = req.query;

    if (!code || !phone) {
      return res.status(400).send({
        message: "Número de pedido y teléfono son requeridos.",
      });
    }

    const order = await Order.findOne({
      code: String(code).trim().toUpperCase(),
      "customer.phone": normalizePhone(phone),
    });

    if (!order) {
      return res.status(404).send({
        message: "Pedido no encontrado.",
      });
    }

    return res.status(200).send(order);
  } catch (error) {
    return next(error);
  }
};

const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    return res.status(200).send(orders);
  } catch (error) {
    return next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!statusLabels[status]) {
      return res.status(400).send({
        message: "Estado de pedido inválido.",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).send({
        message: "Pedido no encontrado.",
      });
    }

    const shouldRestoreInventory =
      status === "cancelled" &&
      order.status !== "cancelled" &&
      order.status !== "completed";

    if (shouldRestoreInventory) {
      await restoreInventoryForOrder(order.items);
    }

    order.status = status;
    order.statusLabel = statusLabels[status];

    await order.save();

    const io = req.app.get("io");

    if (io) {
      io.emit("order:updated", order);
    }

    return res.status(200).send(order);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createOrder,
  getOrderStatus,
  getAdminOrders,
  updateOrderStatus,
};