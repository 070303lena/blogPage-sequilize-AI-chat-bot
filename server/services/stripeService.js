const orderService = require("./orderService");
const { createSubscription } = require("./subscriptionService");
const logger = require("../logger");

const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const webhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (e) {
        logger.error("Webhook error:", e);

        return res.status(400).json({
            message: "Invalid webhook signature"
        });
    }

    try {
        switch (event.type) {

            case "checkout.session.completed": {
                const session = event.data.object;

                if (session.mode === "payment") {
                    await orderService.createOrderFromPayment({
                        id: session.id,
                        paymentIntent: session.payment_intent,
                        amount: session.amount_total,
                        metadata: session.metadata
                    });
                }

                if (session.mode === "subscription") {
                    const subscription = await stripe.subscriptions.retrieve(
                        session.subscription
                    );

                    await createSubscription({
                        userId: session.metadata?.userId,
                        stripeSubscriptionId: subscription.id,
                        stripeCustomerId: subscription.customer,
                        status: subscription.status,
                        priceId: subscription.items.data[0].price.id,
                        currentPeriodStart: subscription.billing_cycle_anchor
                            ? new Date(subscription.billing_cycle_anchor * 1000)
                            : null,
                        currentPeriodEnd: subscription.current_period_end
                            ? new Date(subscription.current_period_end * 1000)
                            : null,
                        cancelAtPeriodEnd: subscription.cancel_at_period_end
                    });
                }
                break;
            }
            default:
                break;
        }

        return res.sendStatus(200);

    } catch (err) {
        logger.error(err);
        return res.sendStatus(400);
    }
};

module.exports = { webhook };
