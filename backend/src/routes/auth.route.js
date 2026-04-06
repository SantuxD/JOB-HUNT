const express = require("express");
const protect = require("../middlewares/auth.Middleware");
const { register, login, getMe } = require("../controllers/auth.controller");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.get("/getMe", protect, getMe);

module.exports = router;
