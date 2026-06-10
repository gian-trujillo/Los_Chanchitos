const router = require("express").Router();

const healthRoutes = require("./healthRoutes");
const menuRoutes = require("./menuRoutes");

router.use("/health", healthRoutes);
router.use("/menu", menuRoutes);

module.exports = router;