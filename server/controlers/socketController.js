const db = require("../database/models");
const { Message, Chat, ChatMember, User } = db;
const logger = require("../logger");

const join_all_chats = async (io, socket) => {
    const userId = socket.user.userId;

    const chats = await ChatMember.findAll({
        where: { user_id: userId }
    });

    if (!chats || chats.length === 0) {
        logger.info(`JOIN: User ${userId} has no active chats.`);
        return;
    }

    chats.forEach(c => {
        socket.join(`chat_${c.chat_id}`);
    });
    logger.info(`SUCCESS: User ${userId} joined ${chats.length} chat rooms.`);
};

const sendMessage = async (io, socket, data) => {
    try {
        if (!data || !data.chatId || !data.text) {
            logger.error(`Invalid message data from user ${socket.user.userId}`);
            return socket.emit("error_response", { message: "chatId and text are required" });
        }

        const senderId = socket.user.userId;
        const { chatId, text } = data;
        const chat = await Chat.findByPk(chatId);
        if (!chat) {
            logger.warn(`Not Found: User ${senderId} tried to send message to non-existent chat ${chatId}`);
            return socket.emit("error_response", { message: "Chat not found" });
        }

        const isMember = await ChatMember.findOne({
            where: {
                chat_id: chatId,
                user_id: senderId
            }
        });

        if (!isMember) {
            logger.warn(`User ${senderId} tried to post in chat ${data.chatId} without permission`);
            return socket.emit("error_response", { message: "You are not a member of this chat" });
        }

        const message = await Message.create({
            text: data.text,
            sender_id: senderId,
            chat_id: data.chatId,
        });

        const result = {
            id: message.id,
            text: message.text,
            chatId: data.chatId,
            sender_id: senderId,
            createdAt: message.createdAt,
        };

        io.to(`chat_${data.chatId}`).emit("receive_message", result);
        logger.info(`SUCCESS: Message ${message.id} sent by User ${senderId} to Chat ${chatId}`);

    } catch (e) {
        logger.error(e);
        socket.emit("error_response", {
            error: "INTERNAL_ERROR"
        });
    }
};

const createGroupChat = async (io, socket, groupMembers, groupName) => {
    try {
        if (!groupName || !Array.isArray(groupMembers)) {
            logger.error(`Validation Error: User ${socket.user.userId} sent invalid group data`);
            return socket.emit("error_response", {
                error: "BAD_REQUEST",
                message: "Group name and members list are required"
            });
        }

        const creatorId = socket.user.userId;
        const allMembers = [...new Set([...groupMembers, creatorId])];

        const existingUsers = await User.findAll({
            where: { id: allMembers },
            attributes: ['id']
        });
        const foundIds = existingUsers.map(u => u.id);
        const missingIds = allMembers.filter(id => !foundIds.includes(id));

        if (missingIds.length > 0) {
            logger.warn(`Group creation aborted: Users [${missingIds.join(', ')}] not found in DB`);
            return socket.emit("error_response", {
                error: "USERS_NOT_FOUND",
                message: "Some users do not exist in the system",
                missingIds
            });
        }

        const newChat = await Chat.create({
            type: "group",
            name: groupName
        });

        const membersData = allMembers.map(id => ({
            chat_id: newChat.id,
            user_id: id
        }));

        await ChatMember.bulkCreate(membersData);

        const roomName = `chat_${newChat.id}`;
        socket.join(roomName);

        const fullChatData = await Chat.findOne({
            where: { id: newChat.id },
            include: [
                {
                    model: ChatMember,
                    as: 'members',
                    include: ['user']
                }
            ]
        });
        logger.info(`SUCCESS: Group "${groupName}" (ID: ${newChat.id}) created by User ${creatorId}`);
        socket.emit("group_created", fullChatData);

    } catch (error) {
        console.log(error);
    }
};

const updateChat = async (io, socket, id, groupMembers, groupName) => {
    try {
        if (!id) {
            logger.error("UPDATE_FAILED: Missing chat ID in request");
            return socket.emit("error_response", { error: "BAD_REQUEST", message: "Chat ID is required for update" });
        }

        if (!groupName || groupName.trim() === "") {
            logger.warn(`UPDATE_FAILED: User ${socket.user.userId} tried to set empty group name for chat ${id}`);
            return socket.emit("error_response", {
                error: "VALIDATION_ERROR",
                message: "Group name cannot be empty"
            });
        }

        const creatorId = socket.user.userId;
        const chat = await Chat.findByPk(id);
        if (!chat) {
            logger.warn(`UPDATE_FAILED: Chat with ID ${id} not found`);
            return socket.emit("error_response", { error: "NOT_FOUND", message: "Chat not found" });
        }

        await Chat.update({ name: groupName }, { where: { id } })

        await ChatMember.destroy({ where: { chat_id: id } })

        const allMembers = [...new Set([...groupMembers, creatorId])];

        const existingUsers = await User.findAll({ where: { id: allMembers } });
        const validIds = existingUsers.map(u => u.id);

        if (validIds.length !== allMembers.length) {
            const missing = allMembers.filter(mid => !validIds.includes(mid));
            logger.warn(`UPDATE_WARNING: Some users not found: ${missing.join(', ')}`);
        }

        await ChatMember.bulkCreate(validIds.map(uId => ({
            chat_id: id,
            user_id: uId
        })));

        const updatedChat = await Chat.findOne({
            where: { id },
            include: [
                {
                    model: ChatMember,
                    as: 'members',
                    include: ['user']
                }
            ]
        });
        io.to(`chat_${id}`).emit("chat_updated", updatedChat);
        logger.info(`SUCCESS: Chat ${id} updated by User ${creatorId}`);

    } catch (error) {
        logger.error(`CRITICAL: update_chat failed: ${error.message}`);
        socket.emit("error_response", {
            error: "INTERNAL_ERROR",
            message: "Failed to update chat data"
        });
    }
}

module.exports = { join_all_chats, sendMessage, createGroupChat, updateChat };