const { Router } = require("express");
const messageController = require("../controllers/messageController.js");

const router = Router();

router.get("/new-message", messageController.newMessage.get);

module.exports = router;
