const jwt = require("jsonwebtoken");
const socketController = require("../controlers/socketController");
const logger = require("../logger");

function initSocket(io) {
    io.use((socket, next) => {
        try {
            const token =
                socket.handshake.auth.token ||
                socket.handshake.headers["authorization"]?.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (e) {
            next(new Error("Auth error"));
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.user.userId;

        logger.info("user connected", socket.id);

        socket.on("join_all_chats", () =>
            socketController.join_all_chats(io, socket)
        );

        socket.on("typing", (roomId) => {
            socket.to(roomId).emit("typing", { roomId, userId });
        });

        socket.on("stop_typing", (roomId) => {
            socket.to(roomId).emit("stop_typing", { roomId, userId });
        });

        socket.on("send_message", (data) =>
            socketController.sendMessage(io, socket, data)
        );

        socket.on("group_chat", ({ groupMembers, groupName }) =>
            socketController.createGroupChat(io, socket, groupMembers, groupName)
        );

        socket.on("update_chat", ({ id, groupMembers, groupName }) =>
            socketController.updateChat(io, socket, id, groupMembers, groupName)
        );

        socket.on("disconnect", () => {
            logger.info(
                `User disconnected: ${socket.id} (User ID: ${socket.user?.userId})`
            );
        });
    });
}

module.exports = initSocket;
