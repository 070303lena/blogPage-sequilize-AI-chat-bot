"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      Like.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE"
      });

      Like.belongsTo(models.Post, {
        foreignKey: "post_id",
        onDelete: "CASCADE"
      });
    }
  }
  Like.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: "Like",
    tableName: "Likes"
  });
  return Like;
};
