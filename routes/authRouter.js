const { Router } = require("express");
const authController = require("../controllers/authController.js");

const router = Router();

router.get("/signup", authController.signup.get);

module.exports = router;
