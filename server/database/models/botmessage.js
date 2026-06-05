"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BotMessage extends Model {
    static associate(models) {
      BotMessage.belongsTo(models.User, { foreignKey: "userId" });
    }
  }

  BotMessage.init(
    {
      role: {
        type: DataTypes.ENUM("user", "assistant"),
        allowNull: false,
      },

      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        }
      },
    },
    {
      sequelize,
      modelName: "BotMessage",
      tableName: "BotMessages",
    }
  );

  return BotMessage;
};