'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SaleItemDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sale_id: {
        type: Sequelize.STRING,
        type: Sequelize.STRING,
        references: {
          model: 'Sale',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      productID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Products',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      qty: {
        type: Sequelize.INTEGER,
      },
      price: {
        type: Sequelize.DOUBLE,
      },
      create_by: {
        type: Sequelize.STRING,
      },
      created_on: {
        type: Sequelize.DATE,
      },
      changed_by: {
        type: Sequelize.STRING,
      },
      changed_on: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SaleItemDetails');
  },
};
