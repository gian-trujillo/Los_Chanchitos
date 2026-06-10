const router = require("express").Router();

const healthRoutes = require("./healthRoutes");
const menuRoutes = require("./menuRoutes");
const inventoryRoutes = require("./inventoryRoutes");
const settingsRoutes = require("./settingsRoutes");

router.use("/health", healthRoutes);
router.use("/menu", menuRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/settings", settingsRoutes);

module.exports = router;