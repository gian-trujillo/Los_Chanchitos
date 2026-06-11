const router = require("express").Router();

const {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");
const auth = require("../middlewares/auth");
const {
  validateCreateMenuItem,
  validateUpdateMenuItem,
  validateMenuItemId,
} = require("../validations/menuValidations");

router.get("/", getMenuItems);
router.post("/", auth, validateCreateMenuItem, createMenuItem);
router.patch("/:id", auth, validateUpdateMenuItem, updateMenuItem);
router.delete("/:id", auth, validateMenuItemId, deleteMenuItem);

module.exports = router;