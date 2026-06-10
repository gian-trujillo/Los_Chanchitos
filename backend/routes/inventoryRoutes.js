const router = require("express").Router();

const {
  getInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} = require("../controllers/inventoryController");
const auth = require("../middlewares/auth");

router.get("/", getInventoryItems);
router.post("/", auth, createInventoryItem);
router.patch("/:id", auth, updateInventoryItem);
router.delete("/:id", auth, deleteInventoryItem);

module.exports = router;