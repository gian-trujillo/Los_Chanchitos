const router = require("express").Router();

const {
  getInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} = require("../controllers/inventoryController");
const auth = require("../middlewares/auth");
const {
  validateCreateInventoryItem,
  validateUpdateInventoryItem,
  validateInventoryItemId,
} = require("../validations/inventoryValidations");

router.get("/", getInventoryItems);
router.post("/", auth, validateCreateInventoryItem, createInventoryItem);
router.patch("/:id", auth, validateUpdateInventoryItem, updateInventoryItem);
router.delete("/:id", auth, validateInventoryItemId, deleteInventoryItem);

module.exports = router;