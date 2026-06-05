const db = require("../database/models");
const logger = require("../logger");

const { Order, Order_items } = db;

const getOrdersList = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            logger.error("Missing userId in request");
            return res.status(401).json({ message: "Unauthorized" });
        }
        const orders = await Order.findAll({
            where: { user_id: userId },
            include: {
                model: Order_items,
                as: "items"
            }
        });
        if (!orders || orders.length === 0) {
            logger.info("No orders found", { userId });
            return res.status(200).json([]);
        }
        return res.status(200).json(orders);
    } catch (error) {
        logger.error("Error in getOrdersList", {
            message: error.message,
            stack: error.stack
        });

        return res.status(400).json({
            message: "Failed to get orders"
        });
    }
};

module.exports = { getOrdersList };