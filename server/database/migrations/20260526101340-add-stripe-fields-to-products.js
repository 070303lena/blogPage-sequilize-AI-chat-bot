"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Products", "stripeProductId", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Products", "stripePriceId", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Products", "stripeProductId");

    await queryInterface.removeColumn("Products", "stripePriceId");
  },
};