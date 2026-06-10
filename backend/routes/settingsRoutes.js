const router = require("express").Router();

const {
  getRestaurantSettings,
  updateRestaurantSettings,
} = require("../controllers/settingsController");

router.get("/", getRestaurantSettings);
router.patch("/", updateRestaurantSettings);

module.exports = router;