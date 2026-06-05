const db = require("../../database/models");
const { Products, Categories } = db;

const searchProducts = async ({ userId, category, maxPrice, minPrice }) => {
    const filteredProducts = async () => {

        const categoryData = await Categories.findOne({
            where : {
                name: category
            }
        })

        if ((minPrice || maxPrice) && !category) {
            return await Products.findAll({
                where: {
                    price: {
                        [Op.between]: [minPrice || 0, maxPrice || Number.MAX_VALUE]
                    }
                }
            });
        } else if (category && !minPrice && !maxPrice) {
            if(!categoryData) return [];

            return await Products.findAll({
                where: {
                    categoryId: categoryData.id
                }
            });
        }
        else if ((minPrice || maxPrice) && category) {
            if(!categoryData) return [];

            return await Products.findAll({
                where: {
                    categoryid: categoryData.id,
                    price: {
                        [Op.between]: [minPrice || 0, maxPrice || Number.MAX_VALUE]
                    }
                }
            });
        } else {
            return []
        }
    };

    return await filteredProducts();
};

module.exports = { searchProducts };
