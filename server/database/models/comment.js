"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {

      Comment.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE"
      });

      Comment.belongsTo(models.Post, {
        foreignKey: "post_id",
        onDelete: "CASCADE"
      });

      Comment.belongsTo(models.Comment, {
        as: "parent",
        foreignKey: "parent_id",
        onDelete: "CASCADE"
      });

      Comment.hasMany(models.Comment, {
        as: "replies",
        foreignKey: "parent_id"
      });
    }
  }

  Comment.init({
    text: {
      type: DataTypes.STRING,
      allowNull: false
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }

  }, {
    sequelize,
    modelName: "Comment",
    tableName: "Comments"
  });

  return Comment;
};