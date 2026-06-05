const cartService = require("../services/cartService");
const logger = require("../logger");

const addCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.userId;
        const item = await cartService.addItem(userId, productId, quantity);

        return res.json({
            success: true,
            item
        });

    } catch (e) {
        logger.error("error", e)
        return res.status(400).json({
            message: "Server error"
        });
    }
};

const getCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        const cart = await cartService.getCart(userId);

        return res.status(200).json({
            success: true,
            result: cart
        });

    } catch (e) {
        return res.status(400).json({
            message: "Server error"
        });
    }
};

const deleteItem = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { itemId } = req.params;

        await cartService.deleteItem(userId, itemId);

        return res.json({ success: true });

    } catch (e) {
        return res.status(400).json({ message: "Server error" });
    }
};

const updateItem = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { itemId } = req.params;
        const { quantity } = req.body;

        const item = await cartService.updateItem(userId, itemId, quantity);

        return res.json({
            success: true,
            item
        });

    } catch (e) {
        return res.status(400).json({ message: "Server error" });
    }
};

module.exports = {
    addCartItem,
    getCart,
    deleteItem,
    updateItem
};