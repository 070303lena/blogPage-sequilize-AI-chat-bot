const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");

const stripeRouter = require("./routes/stripeRoute");
const postsRoutes = require("./routes/postsRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const productsRoutes = require("./routes/productsRoutes");
const likesRoutes = require("./routes/likesRoutes");
const commentsRoutes = require("./routes/commentsRoutes");
const messagesRoutes = require("./routes/messagesRoute");
const chatsRoutes = require("./routes/chatRoutes");
const ordersRoutes = require("./routes/ordersRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const chatBotRoutes = require("./routes/chatBotRoutes");

const app = express();
app.use("/stripe/webhook", express.raw({ type: "application/json" }));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/stripe", stripeRouter);
app.use("/posts", postsRoutes);
app.use("/", authRoutes);
app.use("/cart", cartRoutes);
app.use("/products", productsRoutes);
app.use("/likes", likesRoutes);
app.use("/", commentsRoutes);
app.use("/", messagesRoutes);
app.use("/", chatsRoutes);
app.use("/order", ordersRoutes);
app.use("/subscribe", subscriptionRoutes);
app.use("/botMessages", chatBotRoutes);

module.exports = app;