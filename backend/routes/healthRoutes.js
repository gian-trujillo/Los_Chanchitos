const router = require("express").Router();
const { getHealthStatus } = require("../controllers/healthController");

router.get("/", getHealthStatus);

module.exports = router;