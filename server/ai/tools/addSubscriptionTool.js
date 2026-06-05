const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const logger = require("../../logger");

const addSubscription = async ({ userId }) => {
    if (!userId) {
        logger.error("no userID");
        return {
            success: false,
            message: "UserId is required"
        };
    }

    try {
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID,
                    quantity: 1
                }
            ],
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/products",
            metadata: {
                userId: String(userId)
            }
        });

        return {
            success: true,
            url: session.url
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

module.exports = { addSubscription };