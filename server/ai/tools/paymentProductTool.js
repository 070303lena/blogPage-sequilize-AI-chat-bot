const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const db = require("../../database/models");
const { Cart, CartItem, Products } = db;
const logger = require("../../logger");

const paymentProduct = async ({ userId }) => {
    if (!userId) {
        return {
            success: false,
            message: "UserId is required"
        };
    }

    try {
        const cart = await Cart.findOne({
            where: { userId },
            include: [
                {
                    model: CartItem,
                    include: [
                        {
                            model: Products,
                            as: "Product"
                        }
                    ]
                }
            ]
        });

        if (!cart || !cart.CartItems?.length) {
            return {
                success: false,
                message: "Cart is empty"
            };
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: cart.CartItems.map(item => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.Product?.title || "Product",
                    },
                    unit_amount: Math.round(Number(item.Product.price) * 100)
                },
                quantity: item.quantity
            })),
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cart",
            metadata: {
                userId: String(userId)
            }
        });

        return {
            success: true,
            url: session.url
        };

    } catch (error) {
        logger.error(error, "error in paymentProduct")
        return {
            success: false,
            message: error.message
        };
    }
};

module.exports = { paymentProduct };