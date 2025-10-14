const { Router } = require("express");
const authController = require("../controllers/authController.js");
require("../utils/authInit.js"); // initialize passport

const router = Router();

router.get("/signup", authController.signup.get);
router.get("/login", authController.login.get);
router.get("/continue-as-guest", authController.continueAsGuest.get);

router.post("/signup", authController.signup.post);
router.post("/login", authController.login.post);
router.post("/logout", authController.logout.post);

module.exports = router;
