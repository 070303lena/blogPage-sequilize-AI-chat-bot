const express = require("express");
const router = express.Router();

const { isAuthorised } = require("../middleware/auth");

const {
    getAllChats,
    getChatMessages
} = require("../controlers/messageController");

router.get("/chats", isAuthorised, getAllChats);
router.get("/message/:chatId", isAuthorised, getChatMessages);

module.exports = router;