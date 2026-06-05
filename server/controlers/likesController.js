const { Op } = require("sequelize");
const db = require("../database/models");
const logger = require("../logger");
const { Like, Post, User } = db;

const toggleLike = async (req, res) => {
    try {
        const user_id = req.user.userId;
        const post_id = Number(req.params.id);

        if (Number.isNaN(post_id)) {
            return res.status(400).json({
                message: "Invalid post id"
            });
        }

        const post = await Post.findByPk(post_id);

        if (!post) {
            logger.warn("Post not found", { post_id });

            return res.status(404).json({
                message: "Post not found"
            });
        }

        const deleted = await Like.destroy({
            where: { user_id, post_id }
        });

        if (deleted) {
            logger.info("Like removed", { user_id, post_id });

            return res.status(200).json({
                liked: false,
                message: "Like removed"
            });
        }

        await Like.create({ user_id, post_id });

        logger.info("Like added", { user_id, post_id });

        return res.status(201).json({
            liked: true,
            message: "Like added"
        });

    } catch (error) {
        logger.error("Error in toggle Like:", { error });
        return res.status(400).json({
            message: "Server error"
        });
    }
};

const getUsersLikedPosts = async (req, res) => {
    try {
        const user_id = req.user.userId;

        const likes = await Like.findAll({
            where: { user_id }
        });

        const likedPostsId = likes.map(like => like.post_id);

        if (!likedPostsId.length) {
            return res.status(200).json({
                result: [],
                message: "No liked posts"
            });
        }

        const likedPosts = await Post.findAll({
            where: {
                id: {
                    [Op.in]: likedPostsId
                }
            },
            include: {
                model: User,
                attributes: ["id", "firstName"]
            }
        });

        const result = likedPosts.map(post => ({
            ...post.toJSON(),
            liked: true
        }));

        logger.info("Liked posts fetched", {
            userId: user_id
        });

        return res.status(200).json({
            result,
            message: "success"
        });


    } catch (error) {
        logger.error("Error in get users likes posts:", { error });
        return res.status(400).json({
            message: "error server get liked posts"
        });
    }
};

module.exports = {
    toggleLike,
    getUsersLikedPosts
};
