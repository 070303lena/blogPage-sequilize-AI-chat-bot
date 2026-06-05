const express = require("express");
const router = express.Router();

const { isAuthorised } = require("../middleware/auth");
const { toggleLike, getUsersLikedPosts } = require("../controlers/likesController");

//likes
router.post("/:id", isAuthorised, toggleLike);
router.get("/", isAuthorised, getUsersLikedPosts);

module.exports = router;
