const express = require("express");

const { addNewMessage, getBotMessages, clearBotChatStory } = require("../controlers/chatBotController");
const router = express.Router();
const { isAuthorised } = require("../middleware/auth");

router.get("/", isAuthorised, getBotMessages);
router.post("/create", isAuthorised, addNewMessage);
router.delete("/delete", isAuthorised, clearBotChatStory);

module.exports = router;
