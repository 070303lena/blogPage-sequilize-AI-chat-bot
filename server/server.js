require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const { sequelize } = require("./database/models");
const app = require("./app");
const initSocket = require("./socket/socket");

const PORT = 5000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*" }
});

initSocket(io);

const startServer = async () => {
    await sequelize.authenticate();

    server.listen(PORT, () => {
        console.log(`Server worked at http://localhost:${PORT}/`);
    });
};

startServer();
