const express = require("express");
const router = express.Router();

const { isAuthorised } = require("../middleware/auth");

const { getOrCreatePrivateChat } = require("../controlers/chatController");

const { getAllGroupChats } = require("../controlers/groupsController");

router.post("/private", isAuthorised, getOrCreatePrivateChat);
router.get("/groupchats", isAuthorised, getAllGroupChats);

module.exports = router;