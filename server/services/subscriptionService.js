const { Subscription } = require("../database/models");

const createSubscription = async ({
    userId,
    stripeSubscriptionId,
    stripeCustomerId,
    status,
    priceId,
    currentPeriodStart,
    currentPeriodEnd,
    cancelAtPeriodEnd
}) => {
    if (!userId) return;

    return await Subscription.create({
        userId: Number(userId),
        stripeSubscriptionId,
        stripeCustomerId,
        status,
        priceId,
        currentPeriodStart,
        currentPeriodEnd,
        cancelAtPeriodEnd
    });
};

module.exports = {
    createSubscription
};