const router = require("express").Router();

const healthRoutes = require("./healthRoutes");
const menuRoutes = require("./menuRoutes");
const inventoryRoutes = require("./inventoryRoutes");
const settingsRoutes = require("./settingsRoutes");
const authRoutes = require("./authRoutes");

router.use("/health", healthRoutes);
router.use("/menu", menuRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/settings", settingsRoutes);
router.use("/auth", authRoutes);

module.exports = router;