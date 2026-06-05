"use strict";

module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define("Chat", {
    type: DataTypes.ENUM("private", "group"),
    name: DataTypes.STRING
  }, {});

  Chat.associate = function (models) {
    Chat.hasMany(models.Message, {
      foreignKey: "chat_id",
      as: "messages"
    });

    Chat.hasMany(models.ChatMember, {
      foreignKey: "chat_id",
      as: "members"
    });
    
    Chat.belongsToMany(models.User, {
      through: models.ChatMember,
      foreignKey: "chat_id",
      otherKey: "user_id",
      as: "users"
    });
  };

  return Chat;
};
