const { Op } = require("sequelize");
const db = require("../../database/models");
const { Cart, CartItem, Products, Categories } = db;

const addToCart = async ({ userId, productName, quantity, category }) => {
    const qty = Number(quantity);

    if (!userId) {
        throw new Error("UserId is required", 400);
    }

    if (!productName) {
        throw new Error("ProductName is required", 400);
    }

    if (!qty || qty <= 0) {
        throw new Error("Invalid quantity", 400);
    }

    const [cart] = await Cart.findOrCreate({
        where: { userId },
        defaults: { userId }
    });

    const categoryData = await Categories.findOne({
        where: {
            name: category
        }
    });

    if (!categoryData) {
        throw new Error("Category not found");
    }

    const product = await Products.findOne({
        where: {
            title: {
                [Op.iLike]: `%${productName}%`
            },
            categoryId: categoryData.id
        }
    });

    if (!product) {
        throw new Error("Product not found", 404);
    }

    let item = await CartItem.findOne({
        where: {
            cartId: cart.id,
            productId: product.id
        }
    });

    if (item) {
        item.quantity = Number(item.quantity) + qty;
        await item.save();
    } else {
        item = await CartItem.create({
            cartId: cart.id,
            productId: product.id,
            quantity: qty
        });
    }

    return {
        success: true,
        data: {
            productId: product.id,
            name: product.title,
            price: product.price,
            quantity: item.quantity
        }
    };
};

module.exports = { addToCart };