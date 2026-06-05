const db = require("../database/models");
const { Chat, ChatMember } = db;
const logger = require("../logger");

const getOrCreatePrivateChat = async (req, res) => {
    try {
        const myId = req.user.userId;
        const { userId } = req.body;

        if (!userId) {
            logger.warn(`VALIDATION_ERROR: User ${myId} provided no userId`);
            return res.status(400).json({ message: "Missing userId" });
        }

        const targetUser = await db.User.findByPk(userId);

        if (!targetUser) {
            logger.error(`NOT_FOUND: Target User ${userId} does not exist in database`);
            return res.status(404).json({ message: "User not found" });
        }

        const myChats = await ChatMember.findAll({
            where: { user_id: myId },
            attributes: ["chat_id"]
        });

        const chatIds = myChats.map(c => c.chat_id);

        const existingChat = await Chat.findOne({
            where: {
                id: chatIds,
                type: "private"
            },
            include: [{
                model: ChatMember,
                as: "members",
                where: { user_id: userId }
            }],
        });

        if (existingChat) {
            logger.info(`SUCCESS: Found existing private chat ID: ${existingChat.id} for users ${myId} and ${userId}`);
            return res.json({ chatId: existingChat.id });
        }

        logger.info("Creating new private chat", {
            fromUser: myId,
            targetUser: userId
        });

        const newChat = await Chat.create({
            type: "private"
        });

        await ChatMember.bulkCreate([
            { chat_id: newChat.id, user_id: myId },
            { chat_id: newChat.id, user_id: userId }
        ]);

        return res.json({ chatId: newChat.id });

    } catch (error) {
        logger.error("Error get/create private chat", error);
        return res.status(400).json({ message: "Server error" });
    }
};

module.exports = { getOrCreatePrivateChat };
