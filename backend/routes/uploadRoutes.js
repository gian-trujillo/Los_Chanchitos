const router = require("express").Router();

const { uploadImage } = require("../controllers/uploadController");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.post("/image", auth, upload.single("image"), uploadImage);

module.exports = router;