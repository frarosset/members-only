const { Router } = require("express");
const userController = require("../controllers/userController.js");

const router = Router();

router.get("/user/:id", userController.user.get);
router.get("/my-profile", userController.myProfile.get);

module.exports = router;
