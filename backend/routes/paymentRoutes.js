const router = require("express").Router();

const {
  createPaymentPreference,
} = require("../controllers/paymentController");

router.post("/preference", createPaymentPreference);

module.exports = router;