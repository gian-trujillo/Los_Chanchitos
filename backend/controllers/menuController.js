const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
const MenuItem = require("../models/menuItemModel");

const getMenuItems = async (req, res, next) => {
  try {
    const menuItems = await MenuItem.find().sort({ order: 1, createdAt: 1 });

    res.status(200).send(menuItems);
  } catch (error) {
    next(error);
  }
};

const createMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.create(req.body);

    res.status(201).send(menuItem);
  } catch (error) {
    next(error);
  }
};

const getMenuItemQuery = (identifier) => {
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    return { _id: identifier };
  }

  return { id: identifier };
};

const updateMenuItem = async (req, res, next) => {
  try {
    const existingMenuItem = await MenuItem.findOne(
      getMenuItemQuery(req.params.id)
    );

    if (!existingMenuItem) {
      return res.status(404).send({
        message: "Producto no encontrado",
      });
    }

    const menuItem = await MenuItem.findOneAndUpdate(
      getMenuItemQuery(req.params.id),
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    const imageWasReplaced =
      existingMenuItem.imagePublicId &&
      req.body.imagePublicId &&
      existingMenuItem.imagePublicId !== req.body.imagePublicId;

    if (imageWasReplaced) {
      try {
        await cloudinary.uploader.destroy(existingMenuItem.imagePublicId);
      } catch (cloudinaryError) {
        console.error("Cloudinary old image delete error:", cloudinaryError);
      }
    }

    return res.status(200).send(menuItem);
  } catch (error) {
    return next(error);
  }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findOneAndDelete(
      getMenuItemQuery(req.params.id)
    );

    if (!menuItem) {
      return res.status(404).send({
        message: "Producto no encontrado",
      });
    }

    if (menuItem.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(menuItem.imagePublicId);
      } catch (cloudinaryError) {
        console.error("Cloudinary delete error:", cloudinaryError);
      }
    }

    return res.status(200).send({
      message: "Producto eliminado",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};