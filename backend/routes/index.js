const router = require("express").Router();

const healthRoutes = require("./healthRoutes");
const menuRoutes = require("./menuRoutes");
const inventoryRoutes = require("./inventoryRoutes");

router.use("/health", healthRoutes);
router.use("/menu", menuRoutes);
router.use("/inventory", inventoryRoutes);

module.exports = router;