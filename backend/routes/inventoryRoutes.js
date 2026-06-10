const router = require("express").Router();

const {
  getInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} = require("../controllers/inventoryController");

router.get("/", getInventoryItems);
router.post("/", createInventoryItem);
router.patch("/:id", updateInventoryItem);
router.delete("/:id", deleteInventoryItem);

module.exports = router;