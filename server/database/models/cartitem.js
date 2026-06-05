'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {
      CartItem.belongsTo(models.Cart, {
        foreignKey: 'cartId',
        onDelete: 'CASCADE',
      });

      CartItem.belongsTo(models.Products, {
        foreignKey: 'productId',
        as: 'Product',
        onDelete: 'CASCADE',
      });
    }
  }
  CartItem.init({
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    }
  }, {
    sequelize,
    modelName: 'CartItem',
  });
  return CartItem;
};