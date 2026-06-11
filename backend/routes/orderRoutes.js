const router = require("express").Router();

const {
  createOrder,
  getOrderStatus,
  getAdminOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const auth = require("../middlewares/auth");
const {
  validateCreateOrder,
  validateOrderStatusQuery,
  validateUpdateOrderStatus,
} = require("../validations/orderValidations");

router.post("/", validateCreateOrder, createOrder);
router.get("/status", validateOrderStatusQuery, getOrderStatus);
router.get("/admin", auth, getAdminOrders);
router.patch("/:id/status", auth, validateUpdateOrderStatus, updateOrderStatus);

module.exports = router;