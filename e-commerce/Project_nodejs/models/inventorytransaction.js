'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InventoryTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      InventoryTransaction.belongsTo(models.Inventory, {
        foreignKey: 'inventory_id',
        as: 'inventory'
      });
    }
  }
  InventoryTransaction.init({
    inventory_id: DataTypes.INTEGER,
    transaction_type: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    transaction_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'InventoryTransaction',
  });
  return InventoryTransaction;
};