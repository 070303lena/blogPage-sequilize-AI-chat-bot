const logger = require("../logger");
const db = require("../database/models");

const {Comment, Post, User} = db;

const addComment = async (req, res) => {
    try {
        const user_id = req.user?.userId;

        if (!user_id) {
            return res.status(401).json({message: "Unauthorized"});
        }

        const {text, parent_id} = req.body;
        const {postId} = req.params;
        const postIdNum = Number(postId);

        if (Number.isNaN(postIdNum)) {
            return res.status(400).json({
                message: "Invalid post id"
            });
        }

        if (!text?.trim()) {
            return res.status(400).json({message: "Text is required"});
        }

        const post = await Post.findByPk(postIdNum);

        if (!post) {
            logger.warn("Post not found", {postIdNum});
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const result = await Comment.create({
            text,
            post_id: postIdNum,
            parent_id: parent_id || null,
            user_id
        });

        logger.info(`Comment added for the post with id : ${postId} by the user with id ${user_id}`);

        res.status(201).json({
            result: result,
            message: "Comment created"
        });
    } catch (error) {
        logger.error("Error in addComment:", {error});
        return res.status(400).json({
            message: "Server error"
        });
    }
};

const getCommentsByPost = async (req, res) => {
    try {
        const {postId} = req.params;
        const postIdNum = Number(postId);

        if (Number.isNaN(postIdNum)) {
            return res.status(400).json({
                message: "Invalid post id"
            });
        }

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const result = await Comment.findAndCountAll({
            where: {post_id: postIdNum},
            include: {
                model: User,
                attributes: ["id", "firstName"]
            },
            order: [["createdAt", "ASC"]]
        });

        const comments = result.rows;
        const count = result.count;

        logger.info(`Fetched comments`, {postId, count});

        res.status(200).json({
            result: {comments, count},
            message: "Comments fetched"
        });

    } catch (error) {
        logger.error("Error in get Comments By Post: ", {error});
        res.status(400).json({message: "Server error"});
    }
};

const deleteComment = async (req, res) => {
    try {
        const user_id = req.user.userId;
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                message: "Invalid comment id"
            });
        }

        const comment = await Comment.findByPk(id);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        if (comment.user_id !== user_id) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        await comment.destroy();

        logger.info("Comment deleted", {
            commentId: id,
            userId: user_id
        });
        return res.json({message: "Deleted"});
    } catch (error) {
        logger.error("Error in delete comment: ", {error});
        res.status(400).json({message: "Server error"});
    }
};

module.exports = {addComment, getCommentsByPost, deleteComment};
