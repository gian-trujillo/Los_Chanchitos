const router = require("express").Router();

const healthRoutes = require("./healthRoutes");

router.use("/health", healthRoutes);

module.exports = router;