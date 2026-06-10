const mongoose = require("mongoose");
const InventoryItem = require("../models/inventoryItemModel");

const getInventoryItems = async (req, res, next) => {
  try {
    const inventoryItems = await InventoryItem.find().sort({
      order: 1,
      createdAt: 1,
    });

    res.status(200).send(inventoryItems);
  } catch (error) {
    next(error);
  }
};

const createInventoryItem = async (req, res, next) => {
  try {
    const inventoryItem = await InventoryItem.create(req.body);

    res.status(201).send(inventoryItem);
  } catch (error) {
    next(error);
  }
};

const getInventoryQuery = (identifier) => {
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    return { _id: identifier };
  }

  return { id: identifier };
};

const updateInventoryItem = async (req, res, next) => {
  try {
    const inventoryItem = await InventoryItem.findOneAndUpdate(
      getInventoryQuery(req.params.id),
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!inventoryItem) {
      return res.status(404).send({
        message: "Producto de inventario no encontrado",
      });
    }

    return res.status(200).send(inventoryItem);
  } catch (error) {
    return next(error);
  }
};

const deleteInventoryItem = async (req, res, next) => {
  try {
    const inventoryItem = await InventoryItem.findOneAndDelete(
      getInventoryQuery(req.params.id)
    );

    if (!inventoryItem) {
      return res.status(404).send({
        message: "Producto de inventario no encontrado",
      });
    }

    return res.status(200).send({
      message: "Producto de inventario eliminado",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
};