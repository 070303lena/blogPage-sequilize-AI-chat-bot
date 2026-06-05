"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        firstName: "Lena",
        lastName: "Dev",
        email: "lena@test.com",
        password: await bcrypt.hash("12345678", 10),
        createdAt: new Date(),
        updatedAt: new Date()
      },
        {
        firstName: "Admin",
        lastName: "User",
        email: "771397len@mail.ru",
        password: await bcrypt.hash("12345678", 10),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: "John",
        lastName: "Doe",
        email: "john@test.com",
        password: await bcrypt.hash("12345678", 10),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  }
};