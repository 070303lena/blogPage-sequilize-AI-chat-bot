const express = require("express");
const router = express.Router();

const { isAuthorised, optionalAuth } = require("../middleware/auth");

const {
    getPosts,
    getPostById,
    addPost,
    deletePost,
    editPost
} = require("../controlers/postsController");

router.get("/", optionalAuth, getPosts);
router.get("/:id", optionalAuth, getPostById);
router.post("/", isAuthorised, addPost);
router.delete("/:id", isAuthorised, deletePost);
router.put("/:id", isAuthorised, editPost);

module.exports = router;