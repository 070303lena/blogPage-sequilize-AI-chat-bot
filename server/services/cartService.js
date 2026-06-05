const db = require("../database/models");
const { Cart, CartItem, Products } = db;

const addItem = async (userId, productId, quantity) => {
    let cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
        cart = await Cart.create({ userId });
    }

    let item = await CartItem.findOne({
        where: {
            cartId: cart.id,
            productId
        }
    });

    if (item) {
        item.quantity += Number(quantity);
        await item.save();
    } else {
        item = await CartItem.create({
            cartId: cart.id,
            productId,
            quantity: Number(quantity)
        });
    }
    return item;
};

const getCart = async (userId) => {
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
    return cart?.CartItems ?? [];
};

const deleteItem = async (userId, productId) => {
    const item = await CartItem.findOne({
        where: { productId },
        include: [
            {
                model: Cart,
                where: { userId }
            }
        ]
    });

    if (!item) {
        throw new Error("Item not found");
    }

    await item.destroy();

    return true;
};


const updateItem = async (userId, itemId, quantity) => {
    const item = await CartItem.findOne({
        where: { id: itemId },
        include: [
            {
                model: Cart,
                where: { userId }
            }
        ]
    });

    if (!item) {
        throw new Error("Item not found");
    }

    if (quantity < 1) {
        await item.destroy();
        return true;
    }

    item.quantity = Number(quantity);
    await item.save();

    return item;
};

module.exports = {
    addItem,
    getCart,
    deleteItem,
    updateItem
};