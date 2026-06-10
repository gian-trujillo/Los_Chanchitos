require("dotenv").config();

const mongoose = require("mongoose");
const MenuItem = require("../models/menuItemModel");
const menuSeedData = require("./menuSeedData");

const seedMenu = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await MenuItem.deleteMany({});
    await MenuItem.insertMany(menuSeedData);

    console.log("Menu seed completed");
    process.exit(0);
  } catch (error) {
    console.error("Menu seed failed:", error);
    process.exit(1);
  }
};

seedMenu();