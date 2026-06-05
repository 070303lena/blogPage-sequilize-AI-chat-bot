const cartService = require("../../services/cartService");
const { Op } = require("sequelize");
const db = require("../../database/models");
const { Products } = db;
const logger = require("../../logger");

const removeFromCart = async ({ userId, productName }) => {
    try {
        const product = await Products.findOne({
            where: {
                title: {
                    [Op.iLike]: `%${productName}%`
                }
            }
        });

        if (!product) {
            return {
                success: false,
                message: "Product not found"
            };
        }

        await cartService.deleteItem(userId, product.id);
        return { success: true, productName };

    } catch (e) {
        logger.error("REMOVE FROM CART ERROR:", e);
        return { success: false, message: "Server error" };
    }
};

module.exports = { removeFromCart };