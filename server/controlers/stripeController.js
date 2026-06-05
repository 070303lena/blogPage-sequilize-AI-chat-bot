const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const { User, Cart, CartItem, Products } = require("../database/models");

const checkout = async (req, res) => {
    const userId = req.user.userId;

    const user = await User.findByPk(userId);

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

    if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
    }

    let customer;

    if (user.stripeCustomerId) {
        try {
            customer = await stripe.customers.retrieve(user.stripeCustomerId);

            if (customer.deleted) {
                throw new Error("Customer deleted");
            }
        } catch (err) {
            customer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    userId: String(userId)
                }
            });

            await user.update({
                stripeCustomerId: customer.id
            });
        }
    } else {
        customer = await stripe.customers.create({
            email: user.email,
            metadata: {
                userId: String(userId)
            }
        });

        await user.update({
            stripeCustomerId: customer.id
        });
    }

    const line_items = cart.CartItems.map(item => {
        const imageUrl = `${process.env.BASE_URL}${item.Product.image}`;
        return ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.Product?.title || "Product",
                    images: imageUrl ? [imageUrl] : []
                },
                unit_amount: Math.round(Number(item.Product.price) * 100)
            },
            quantity: item.quantity
        })
    });

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer: customer.id,
        line_items,
        success_url: "http://localhost:5173/success",
        cancel_url: "http://localhost:5173/cart",
        metadata: {
            userId: String(userId)
        }
    });

    return res.json({
        url: session.url
    });
};

const subscription = async (req, res) => {
    const userId = req.user.userId;

    const user = await User.findByPk(userId);

    let customer;

    if (user.stripeCustomerId) {
        customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
        customer = await stripe.customers.create({
            email: user.email,
            metadata: {
                userId: String(userId)
            }
        });

        await user.update({
            stripeCustomerId: customer.id
        });
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        customer: customer.id,
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

    return res.json({
        url: session.url
    });
};

module.exports = {
    checkout,
    subscription
};