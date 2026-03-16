'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SaleItem extends Model {
    static associate(models) {
      SaleItem.belongsTo(models.Sale, { foreignKey: 'saleId', as: 'sale' });
      SaleItem.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
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