const router = require("express").Router();

const {
  getRestaurantSettings,
  updateRestaurantSettings,
} = require("../controllers/settingsController");
const auth = require("../middlewares/auth");

router.get("/", getRestaurantSettings);
router.patch("/", auth, updateRestaurantSettings);

module.exports = router;