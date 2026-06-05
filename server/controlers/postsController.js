const logger = require("../logger");
const db = require("../database/models");
const { User, Post, Like } = db;
const { Op } = require("sequelize");

const getPostById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const user_id = req.user?.userId;

        if (Number.isNaN(id)) {
            return res.status(400).json({
                message: "Invalid post id"
            });
        }

        const post = await Post.findByPk(id, {
            include: {
                model: User,
                attributes: ["id", "firstName"]
            }
        });

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        let liked = false;

        if (user_id) {
            const like = await Like.findOne({
                where: { user_id, post_id: id }
            });

            liked = !!like;
        }

        logger.info(`Get post by id: ${id}`)

        return res.status(200).json({
            result: { ...post.toJSON(), liked },
            message: "Success"
        });

    } catch (error) {
        logger.error("Error in get post by id: ", { error });
        return res.status(400).json({
            message: "Server error"
        });
    }
};

const addPost = async (req, res) => {
    try {
        const author_id = req.user.userId;

        if (!author_id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        
        const { title, description } = req.body

        if (!title?.trim() || !description?.trim()) {
            return res.status(400).json({ message: "Invalid data" });
        }

        const newPost = await Post.create({
            title,
            description,
            author_id
        });

        const postWithUser = await Post.findByPk(newPost.id, {
            include: {
                model: User,
                attributes: ["id", "firstName"]
            }
        });

        logger.info(`Added new post by user with id: ${author_id}`);

        return res.status(201).json({
            result: postWithUser,
            message: "Post saved"
        });
    } catch (error) {
        logger.error("Error in addPost: ", { error });
        return res.status(400).json({
            message: "Server error"
        });
    }
};

const getPosts = async (req, res) => {
    try {
        const { page = 1, limit = 3, title = "" } = req.query;

        const offset = limit * (page - 1);
        const user_id = req.user?.userId;

        const posts = await Post.findAndCountAll({
            where: {
                title: {
                    [Op.iLike]: `%${title}%`
                }
            },
            include: {
                model: User,
                attributes: ["id", "firstName"]
            },
            order: [["createdAt", "DESC"]],
            limit,
            offset
        });

        const likes = user_id
            ? await Like.findAll({ where: { user_id } })
            : [];

        const likedIds = new Set(likes.map(like => like.post_id));

        const totalItems = posts.count
        const postsWithLike = posts.rows.map(post => ({
            ...post.toJSON(),
            liked: likedIds.has(post.id)
        }));

        const totalPages = Math.ceil(totalItems / limit);

        logger.info(`Get posts`);

        return res.json({
            result: { posts: postsWithLike, totalPages },
            message: "ok"
        });

    } catch (error) {
        logger.error("Error in get Posts: ", { error });
        return res.status(400).json({
            message: "Server error"
        });
    }
};

const deletePost = async (req, res) => {
    try {
        const author_id = req.user.userId;
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                message: "Invalid post id"
            });
        }

        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.author_id !== author_id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const result = await post.destroy();

        logger.info(`Deleted post with id ${id}`);

        return res.status(200).json({
            message: "Deleted"
        });

    } catch (error) {
        logger.error("Error in deletePost: ", { error });
        return res.status(400).json({
            message: "Server error"
        });
    }
};

const editPost = async (req, res) => {
    try {
        const author_id = req.user.userId;
        const id = Number(req.params.id);
        const { title, description } = req.body;

        if (Number.isNaN(id)) {
            return res.status(400).json({
                message: "Invalid post id"
            });
        }

        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.author_id !== author_id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const [updatedCount] = await Post.update(
            { title, description },
            {
                where: {
                    id,
                    author_id
                }
            })

        logger.info(`Updated post with id ${id}`)

        return res.status(200).json({

            message: "Post updated successfully"
        });
    } catch (error) {
        logger.error("Error in editPost: ", { error });
        return res.status(400).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getPostById,
    addPost,
    getPosts,
    deletePost,
    editPost
};
