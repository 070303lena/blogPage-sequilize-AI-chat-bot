const db = require("../database/models");
const logger = require("../logger");
const { Subscription } = db;

const subscription = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            logger.warn("subscription check without userId");
            return res.status(400).json({
                hasSubscription: false,
                message: "No userId"
            });
        }
        const sub = await Subscription.findOne({
            where: {
                userId,
                status: "active"
            },
        });

        if (!sub) {
            logger.info(`User ${userId} has no subscription`);
            return res.json({
                hasSubscription: false,
                message: "No subscription found"
            });
        }

        return res.status(200).json({
            hasSubscription: true,  
        });

    } catch (error) {
        logger.error("Subscription check error", error);

        return res.status(400).json({
            hasSubscription: false,
            message: "Server error"
        });
    }
};

module.exports = { subscription };
