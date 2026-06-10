require("dotenv").config();

const mongoose = require("mongoose");
const RestaurantSettings = require("../models/restaurantSettingsModel");
const settingsSeedData = require("./settingsSeedData");

const seedSettings = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await RestaurantSettings.deleteMany({});
    await RestaurantSettings.create(settingsSeedData);

    console.log("Settings seed completed");
    process.exit(0);
  } catch (error) {
    console.error("Settings seed failed:", error);
    process.exit(1);
  }
};

seedSettings();