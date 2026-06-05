const db = require("../database/models");
const logger = require("../logger");
const { User, Message, ChatMember, Chat } = db;

const getAllGroupChats = async (req, res) => {
    try {
        const loginedUserId = req.user.userId;

        if (!loginedUserId) {
            logger.warn("Unauthorized request to get group chats");

            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const members = await ChatMember.findAll({
            where: { user_id: loginedUserId },
            include: {
                model: Chat,
                as: "chat",
            }
        });

        logger.info("Group chats fetched", {
            userId: loginedUserId,
            chatsCount: members.length
        });

        const chats = members.map(m => m.chat);

        res.status(200).send({
            result: chats,
            message: "All group chats"
        });
        
    } catch (error) {
        logger.error("Error fetching group chats", error);
        res.status(400).json({
            message: "Internal server error"
        });
    }
};

module.exports = { getAllGroupChats };
