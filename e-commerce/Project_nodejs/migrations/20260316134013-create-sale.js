"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Sales", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      invoiceId: Sequelize.STRING,
      totalAmount: Sequelize.DECIMAL,
      tax: Sequelize.DECIMAL,
      paymentMethod: Sequelize.STRING,
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Users", // **must match table name exactly**
          key: "id",
        },
        onDelete: "SET NULL",
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Sales");
  },
};
