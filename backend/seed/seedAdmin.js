require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const AdminUser = require("../models/adminUserModel");

const seedAdmin = async () => {
  try {
    const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required in .env");
    }

    await mongoose.connect(MONGODB_URI);

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await AdminUser.findOneAndUpdate(
      { email: ADMIN_EMAIL.toLowerCase() },
      {
        email: ADMIN_EMAIL.toLowerCase(),
        passwordHash,
        role: "admin",
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    console.log("Admin seed completed");
    process.exit(0);
  } catch (error) {
    console.error("Admin seed failed:", error);
    process.exit(1);
  }
};

seedAdmin();