'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_items extends Model {
    static associate(models) {
      Order_items.belongsTo(models.Order, {
        foreignKey: "order_id",
        as: "order",
        onDelete: "CASCADE"
      });

      Order_items.belongsTo(models.Products, {
        foreignKey: "product_id",
        as: "Product",
        onDelete: "CASCADE"
      });
    }
  }
  Order_items.init({
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Order_items',
  });
  return Order_items;
};