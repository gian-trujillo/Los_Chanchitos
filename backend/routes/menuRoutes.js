const router = require("express").Router();

const {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");
const auth = require("../middlewares/auth");

router.get("/", getMenuItems);
router.post("/", auth, createMenuItem);
router.patch("/:id", auth, updateMenuItem);
router.delete("/:id", auth, deleteMenuItem);

module.exports = router;