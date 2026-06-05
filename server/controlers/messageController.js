const db = require("../database/models");
const logger = require("../logger");
const { Op } = require("sequelize");
const { User, ChatMember, Chat, Message } = db;

const getChatMessages = async (req, res) => {
    try {
        const myId = req.user.userId;
        const chatId = Number(req.params.chatId);

        logger.info("Fetching chat messages", { myId, chatId });

        if (isNaN(chatId)) {
            return res.status(400).json({
                message: "Invalid chat id"
            });
        }

        if (!myId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const chatExists = await Chat.findByPk(chatId);

        if (!chatExists) {
            return res.status(404).json({
                result: [],
                message: "Chat not found"
            });
        }

        const isMember = await ChatMember.findOne({
            where: {
                chat_id: chatId,
                user_id: myId
            }
        });

        if (!isMember) {
            return res.status(403).json({
                message: "Not a member of this chat"
            });
        }

        const messages = await Message.findAll({
            where: { chat_id: chatId },
            include: [
                {
                    model: User,
                    as: "sender",
                    attributes: ["id", "firstName", "lastName"]
                }
            ],
            order: [["createdAt", "ASC"]]
        });

        const result = messages.map(msg => ({
            ...msg.dataValues,
            from: msg.sender_id === myId ? "me" : "other"
        }));

        return res.json({ result: result, message: "chat Messages" });

    } catch (error) {
        logger.error("Error in getChatMessages: ", { error });
        return res.status(400).json({
            message: "Server error"
        });
    }
};

const getAllChats = async (req, res) => {
    try {
        const myId = req.user.userId;

        if (!myId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const memberships = await ChatMember.findAll({
            where: { user_id: myId }
        });

        const chatIds = memberships.map(m => m.chat_id);

        if (!chatIds.length) {
            return res.json({ result: [], message: "No chats" });
        }

        const chats = await Chat.findAll({
            where: {
                id: {
                    [Op.in]: chatIds
                }
            },
            attributes: ["id", "type", "name", "createdAt"],
            include: [
                {
                    model: ChatMember,
                    as: "members",
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["id", "firstName", "lastName"]
                        }
                    ]
                }
            ]
        });

        logger.info("Get all chats", { userId: myId });

        return res.status(200).json({
            result: chats,
            message: "user messages"
        });

    } catch (error) {
        logger.error("Error in getAllChats: ", error);
        return res.status(400).json({
            message: "Server error"
        });
    }
};

module.exports = { getChatMessages, getAllChats };
