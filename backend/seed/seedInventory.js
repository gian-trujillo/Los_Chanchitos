require("dotenv").config();

const mongoose = require("mongoose");
const InventoryItem = require("../models/inventoryItemModel");
const inventorySeedData = require("./inventorySeedData");

const seedInventory = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await InventoryItem.deleteMany({});
    await InventoryItem.insertMany(inventorySeedData);

    console.log("Inventory seed completed");
    process.exit(0);
  } catch (error) {
    console.error("Inventory seed failed:", error);
    process.exit(1);
  }
};

seedInventory();