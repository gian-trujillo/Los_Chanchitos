const router = require("express").Router();

const {
  createOrder,
  getOrderStatus,
  getAdminOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const auth = require("../middlewares/auth");

router.post("/", createOrder);
router.get("/status", getOrderStatus);
router.get("/admin", auth, getAdminOrders);
router.patch("/:id/status", auth, updateOrderStatus);

module.exports = router;