const router = require("express").Router();

const {
  loginAdmin,
  getCurrentAdmin,
} = require("../controllers/authController");
const auth = require("../middlewares/auth");
const { validateLogin } = require("../validations/authValidations");

router.post("/login", validateLogin, loginAdmin);
router.get("/me", auth, getCurrentAdmin);

module.exports = router;