const { Router } = require("express");
const messageController = require("../controllers/messageController.js");

const router = Router();

router.get("/new-message", messageController.newMessage.get);

router.post("/new-message", messageController.newMessage.post);

module.exports = router;
