const db = require("../../database/models");
const { Cart, CartItem, Products } = db;

const getCart = async ({ userId }) => {
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

    if (!cart) {
        return {
            success: true,
            cartId: null,
            items: []
        };
    }

    return {
        success: true,
        cartId: cart.id,
        items: cart.CartItems?.map(item => ({
            productId: item.productId,
            name: item.Product?.title || "Deleted product",
            price: item.Product?.price || 0,
            quantity: item.quantity
        })) || []
    };
};

module.exports = { getCart };