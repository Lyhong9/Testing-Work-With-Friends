'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SaleItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SaleItem.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product'
      });
      SaleItem.belongsTo(models.Sale, {
        foreignKey: 'saleId',
        as: 'sale'
      });
    }
  }
  SaleItem.init({
    saleId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'SaleItem',
  });
  return SaleItem;
};