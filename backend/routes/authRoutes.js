const router = require("express").Router();

const {
  loginAdmin,
  getCurrentAdmin,
} = require("../controllers/authController");
const auth = require("../middlewares/auth");

router.post("/login", loginAdmin);
router.get("/me", auth, getCurrentAdmin);

module.exports = router;