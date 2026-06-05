"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Comments", [
      {
        text: "Great post!",
        user_id: 1,
        post_id: 1,
        parent_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: "Thanks!",
        user_id: 2,
        post_id: 1,
        parent_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Comments", null, {});
  }
};
