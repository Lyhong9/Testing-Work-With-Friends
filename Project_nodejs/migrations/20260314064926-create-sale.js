'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sales', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sale_id: {
        type: Sequelize.STRING
      },
      invoice_id: {
        type: Sequelize.STRING
      },
      sale_date: {
        type: Sequelize.DATE
      },
      amount: {
        type: Sequelize.DOUBLE
      },
      sub_total: {
        type: Sequelize.DOUBLE
      },
      tax: {
        type: Sequelize.DECIMAL
      },
      pay_method: {
        type: Sequelize.STRING
      },
      create_by: {
        type: Sequelize.STRING
      },
      created_on: {
        type: Sequelize.DATE
      },
      changed_by: {
        type: Sequelize.STRING
      },
      changed_on: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Sales');
  }
};