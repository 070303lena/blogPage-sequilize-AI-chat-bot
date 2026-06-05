"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post, {
        foreignKey: "author_id",
        onDelete: "CASCADE"
      });

      User.hasMany(models.Like, {
        foreignKey: "user_id",
        onDelete: "CASCADE"
      });
      User.hasMany(models.ChatMember, {
        foreignKey: "user_id",
        as: "chatMemberships"
      });
      User.hasMany(models.Order, {
        foreignKey: "user_id",
        as: "order"
      });
      User.belongsToMany(models.Chat, {
        through: models.ChatMember,
        foreignKey: "user_id",
        otherKey: "chat_id",
        as: "chats"
      });
      User.hasOne(models.Cart, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
      User.hasOne(models.Subscription, {
        foreignKey: "userId",
        as: "subscription",
      });
      User.hasMany(models.Message, {
        foreignKey: "sender_id",
        as: "messages",
      });
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stripeCustomerId: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: "User",
    tableName: "Users"
  });
  return User;
};
