"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.User, {
        foreignKey: "sender_id",
        as: "sender",
        onDelete: "CASCADE"
      });

      Message.belongsTo(models.Chat, {
        foreignKey: "chat_id",
        as: "chat",
        onDelete: "CASCADE"
      });
    }
  }
  Message.init({
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    chat_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: "Message",
  });
  return Message;
};