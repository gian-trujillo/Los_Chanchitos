const router = require("express").Router();

const {
  createPaymentPreference,
  handlePaymentWebhook,
} = require("../controllers/paymentController");
const {
  validateCreatePaymentPreference,
} = require("../validations/paymentValidations");

router.post("/preference", validateCreatePaymentPreference, createPaymentPreference);
router.post("/webhook", handlePaymentWebhook);

module.exports = router;