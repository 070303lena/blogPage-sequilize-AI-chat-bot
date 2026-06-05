const { error } = require("winston");
const logger = require("../logger");
const db = require("../database/models");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const { Categories, Products, CartItem } = db;

const addCategory = async (req, res) => {
    try {
        const newCategoryName = req.body.item;

        if (newCategoryName.trim() === "") {
            logger.error("empty")
            return res.status(400).json({
                message: "Category name is required"
            });
        }

        const result = await Categories.create({
            name: newCategoryName
        });

        logger.info("Category created");
        res.status(201).json({ result, message: "Category created" })

    } catch (error) {
        logger.error("Error in addCategory", error)
        return res.status(400).json({
            message: "Server error"
        });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Categories.findAll();
        res.status(200).json({ result: categories, message: "All Categories" })
    } catch (error) {
        logger.error(error, "error in getCategories")
        return res.status(400).json({
            message: "Server error"
        });
    }
};

const addProduct = async (req, res) => {
    try {
        const { name, price, categoryName } = req.body;

        if (!req.file) {
            return res.status(400).json({
                message: "Image is required",
            });
        }

        if (!name || !price || !categoryName) {
            logger.error("All fields are required")
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const numericPrice = Number(price);

        if (isNaN(numericPrice) || numericPrice <= 0) {
            return res.status(400).json({
                message: "Invalid price"
            });
        }
        const currentCategory = await Categories.findOne({
            where: { name: categoryName }
        });

        if (!currentCategory) {
            return res.status(400).json({
                message: "Category not found"
            });
        }
        const currentId = currentCategory.dataValues.id;

        if (!currentId) {
            logger.error("Нет такой категории");
        }
        const imagePath = `/uploads/${req.file.filename}`;

        const imageUrl = `${process.env.BASE_URL}${imagePath}`;

        if (!imageUrl) {
            throw new Error("no image url")
        }

        const stripeProduct = await stripe.products.create({
            name: name,
            images: imageUrl ? [imageUrl] : []
        });

        const stripePrice = await stripe.prices.create({
            product: stripeProduct.id,
            unit_amount: Math.round(Number(price) * 100),
            currency: "usd"
        });

        const result = await Products.create({
            title: name,
            price: price,
            image: imagePath,
            categoryId: currentId,
            stripeProductId: stripeProduct.id,
            stripePriceId: stripePrice.id
        });

        res.status(201).json({ result, message: "Product added" })
    } catch (error) {
        logger.error(error, "error in addProduct")

        return res.status(400).json({
            message: "Server error"
        });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Products.findAll({
            include: [
                {
                    model: Categories,
                    as: "categories",
                },
            ],
        });

        res.status(200).json({ result: products, message: "all products" });
    } catch (error) {
        logger.error("error in getProducts", error);
        return res.status(400).json({
            message: "Server error"
        });
    }
};

module.exports = { addCategory, getCategories, addProduct, getProducts };
