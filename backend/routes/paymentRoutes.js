const router = require("express").Router();

const {
  createPaymentPreference,
  handlePaymentWebhook,
} = require("../controllers/paymentController");

router.post("/preference", createPaymentPreference);
router.post("/webhook", handlePaymentWebhook);

module.exports = router;