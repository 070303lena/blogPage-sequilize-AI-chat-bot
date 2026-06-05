'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    static associate(models) {
      Products.belongsTo(models.Categories, {
        foreignKey: "categoryId",
        as: "categories",
        onDelete: "CASCADE"
      });
      Products.hasMany(models.Order_items, {
        foreignKey: "product_id"
      });
      Products.hasMany(models.CartItem, {
        foreignKey: 'productId',
        as: 'cartItems',
        onDelete: 'CASCADE',
      });
    }
  };

  Products.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    image: DataTypes.STRING,
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stripeProductId: DataTypes.STRING,
    stripePriceId: DataTypes.STRING
  }, {
    sequelize,
    tableName: "Products"
  });
  return Products;
};