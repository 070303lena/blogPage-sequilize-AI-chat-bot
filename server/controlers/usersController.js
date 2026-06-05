const db = require("../database/models");
const { User, Post, Like } = db;

const Jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const logger = require("../logger");
const validator = require("validator");

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
    throw new Error("JWT_SECRET is not defined");
}

const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const cleanEmail = email.trim().toLowerCase();
        const cleanFirstName = firstName.trim();
        const cleanLastName = lastName.trim();

        if (!cleanFirstName || !cleanLastName || !cleanEmail || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (!password || password.length < 8) {
            return res.status(400).json({
                message: "Your password must be at least 8 characters long"
            });
        }

        if (!validator.isEmail(cleanEmail)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        const existingUser = await User.findOne({
            where: { email: cleanEmail }
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstName: cleanFirstName,
            lastName: cleanLastName,
            email: cleanEmail,
            password: hashedPassword
        });

        const safeUser = newUser.toJSON();
        delete safeUser.password;

        logger.info(`registered with id ${safeUser.id}`);

        return res.status(201).json({
            result: safeUser,
            message: "success"
        });

    } catch (error) {
        logger.error("Error in register User:", { error });
        res.status(400).json({
            message: "Server error"
        });
    }
};

const getMe = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findByPk(userId, {
            attributes: ["id", "firstName", "lastName", "email"]
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        logger.info(`Get info about current user with id ${userId}`)

        return res.json({
            result: { user },
            message: "current user"
        });

    } catch (error) {
        logger.error("Error in get me:", { error });
        res.status(400).json({
            message: "Server error"
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            where: { email: cleanEmail }
        });

        if (!user) {
            return res.status(401).json({
                message: "Wrong login or password"
            });
        }

        const checkPasswords = await bcrypt.compare(password, user.password);

        if (!checkPasswords) {
            return res.status(401).json({
                message: "Wrong login or password"
            });
        }

        const token = Jwt.sign(
            { userId: user.id },
            SECRET_KEY,
            { expiresIn: "24h" }
        );

        logger.info(`logined with email: ${cleanEmail}, user id = ${user.id}`)

        return res.json({
            result: {
                token,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    email: user.email
                }
            },
            message: "logined"
        });

    } catch (error) {
        logger.error("Error in login user:", { error });
        res.status(400).json({
            message: error.message
        });
    }
};

const getUserProfilData = async (req, res) => {
    try {
        const user_id = req.user.userId;

        const user = await User.findByPk(user_id);

        const posts = await Post.findAll({
            where: {
                author_id: user_id
            },
            include: {
                model: User,
                attributes: ["id", "firstName"]
            },
            order: [["createdAt", "DESC"]]
        });

        const likes = await Like.findAll({
            where: { user_id }
        });

        const likedIds = new Set(likes.map(like => like.post_id));

        const userPosts = posts.map(post => ({
            ...post.toJSON(),
            liked: likedIds.has(post.id)
        }));

        logger.info(`Get users profile data, userId - ${user_id}`)

        return res.json({
            result: {
                user,
                userPosts
            },
            message: "users posts data"
        });

    } catch (error) {
        logger.error("Error in get current user profile data: ", { error });
        res.status(400).json({
            message: "Server error"
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({
                message: "New password must be at least 8 characters"
            });
        }

        const userID = req.user.userId;
        const user = await User.findByPk(userID);

        const checkPasswords = await bcrypt.compare(
            oldPassword,
            user.password
        );

        if (!checkPasswords) {
            return res.status(400).json({
                message: "Incorrect old password"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.update(
            { password: hashedPassword },
            { where: { id: userID } }
        );

        logger.info(`Changed password for user with id ${userID}`);

        return res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {
        logger.error("Error in changePassword:", { error });
        res.status(400).json({
            message: "Server error"
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const myId = req.user.userId;

        const users = await User.findAll({
            where: {
                id: { [db.Sequelize.Op.ne]: myId }
            },
            attributes: ["id", "firstName", "lastName", "email"]
        });

        logger.info(`User ${myId} requested all users list`);

        return res.json({
            result: users,
            message: "All users"
        });
    } catch (error) {
        logger.error("Error in getAllUsers:", { error });
        res.status(400).json({
            message: "Server error"
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfilData,
    changePassword,
    getMe,
    getAllUsers
};
