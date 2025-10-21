const { Router } = require("express");
const userController = require("../controllers/userController.js");

const router = Router();

router.get("/user/:id", userController.user.get);

module.exports = router;
