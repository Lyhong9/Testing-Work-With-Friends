'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Inventory.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product'
      });

      Inventory.hasMany(models.InventoryTransaction, {
        foreignKey: 'inventory_id',
        as: 'inventoryTransactions'
      });
    }
  }
  Inventory.init({
    item_name: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    unit_price: DataTypes.DECIMAL,
    supplier: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Inventory',
  });
  return Inventory;
};