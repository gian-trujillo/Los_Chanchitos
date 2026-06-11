const router = require("express").Router();

const {
  getRestaurantSettings,
  updateRestaurantSettings,
} = require("../controllers/settingsController");
const auth = require("../middlewares/auth");
const { validateUpdateSettings } = require("../validations/settingsValidations");

router.get("/", getRestaurantSettings);
router.patch("/", auth, validateUpdateSettings, updateRestaurantSettings);

module.exports = router;