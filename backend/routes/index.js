const router = require("express").Router();

const healthRoutes = require("./healthRoutes");
const menuRoutes = require("./menuRoutes");
const inventoryRoutes = require("./inventoryRoutes");
const settingsRoutes = require("./settingsRoutes");
const authRoutes = require("./authRoutes");
const orderRoutes = require("./orderRoutes");
const paymentRoutes = require("./paymentRoutes");
const uploadRoutes = require("./uploadRoutes");

router.use("/health", healthRoutes);
router.use("/menu", menuRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/settings", settingsRoutes);
router.use("/auth", authRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/uploads", uploadRoutes);

module.exports = router;