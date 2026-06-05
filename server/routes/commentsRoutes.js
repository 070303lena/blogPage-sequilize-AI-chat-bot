const express = require("express");
const router = express.Router();

const { isAuthorised } = require("../middleware/auth");

const { addComment, getCommentsByPost, deleteComment } = require("../controlers/commentsController");

// comments
router.post("/posts/:postId/comments", isAuthorised, addComment);
router.get("/posts/:postId/comments", isAuthorised, getCommentsByPost);
router.delete("/comments/:id", isAuthorised, deleteComment);

module.exports = router;
