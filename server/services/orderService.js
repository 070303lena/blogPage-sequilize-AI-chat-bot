const { Cart, CartItem, Products, Order, Order_items } = require("../database/models");
const logger = require("../logger");

const createOrderFromPayment = async (paymentIntent) => {
    try {
        const userId = paymentIntent.metadata?.userId;

        if (!userId) {
            logger.error("Missing userId in session metadata", {
                paymentIntentId: paymentIntent.id
            });
            return;
        }

        const cart = await Cart.findOne({
            where: { userId },
            include: [
                {
                    model: CartItem,
                    include: [{ model: Products, as: "Product" }]
                }
            ]
        });

        if (!cart || !cart.CartItems?.length) {
            logger.warn("Cart is empty or not found", { userId });
            return
        };

        const existingOrder = await Order.findOne({
            where: { stripeSessionId: paymentIntent.id }
        });

        if (existingOrder) {
            logger.warn("Order already exists (duplicate webhook)", {
                sessionId: session.id
            });
            return
        };

        const order = await Order.create({
            user_id: userId,
            totalPrice: paymentIntent.amount / 100,
            status: "paid",
            stripeSessionId: paymentIntent.id
        });

        await Order_items.bulkCreate(
            cart.CartItems.map(item => ({
                order_id: order.id,
                product_id: item.productId,
                quantity: item.quantity,
                price: Number(item.Product.price)
            }))
        );

        await CartItem.destroy({ where: { cartId: cart.id } });

        return order;
    } catch (error) {
        logger.error("Error in createOrderFromPayment", {
            message: error.message,
            stack: error.stack
        });
    }
};

module.exports = {
    createOrderFromPayment
};