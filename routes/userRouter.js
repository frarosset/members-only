const { Router } = require("express");
const userController = require("../controllers/userController.js");

const router = Router();

router.get("/user/:id", userController.user.get);
router.get("/my-profile", userController.myProfile.get);
router.get("/join-the-club", userController.joinTheClub.get);
router.get("/become-admin", userController.becomeAdmin.get);

router.post("/join-the-club", userController.joinTheClub.post);
router.post("/become-admin", userController.becomeAdmin.post);

module.exports = router;
