"use strict";

module.exports = (sequelize, DataTypes) => {
  const ChatMember = sequelize.define("ChatMember", {
    chat_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});

  ChatMember.associate = function (models) {
    ChatMember.belongsTo(models.Chat, {
      foreignKey: "chat_id",
      as: "chat",
      onDelete: "CASCADE"
    });

    ChatMember.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
      onDelete: "CASCADE"
    });
  };

  return ChatMember;
};