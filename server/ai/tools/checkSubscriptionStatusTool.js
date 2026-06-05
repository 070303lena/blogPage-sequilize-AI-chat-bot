const db = require("../../database/models");
const { Subscription } = db;

const checkSubscriptionStatus = async ({userId}) => {
    if (!userId) {
        return {
            success: false,
            message: "UserId is required"
        };
    }

    const sub = await Subscription.findOne({
        where: {
            userId,
        }
    });

    if (!sub) {
        return {
            success: true,
            active: false,
            status: "not_found"
        };
    }

    return {
        success: true,
        active: true,
        status: sub.status
    };
};

module.exports = { checkSubscriptionStatus };