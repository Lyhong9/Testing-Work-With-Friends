// e.g. 20260316135000-create-rolepermissions-table.js
'use strict';

const { ref } = require("node:process");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rolepermissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Roles',
          key: 'id',
        },
      },
      permissionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Permissions',
          key: 'id',
        },
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

    await queryInterface.addIndex('rolepermissions', ['roleId', 'permissionId'], {
      unique: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Rolepermissions');
  },
};