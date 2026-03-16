'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    static associate(models) {
      Sale.hasMany(models.SaleItem, { foreignKey: 'saleId', as: 'saleItems' });
      Sale.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Sale.hasOne(models.Payment, { foreignKey: 'saleId', as: 'payment' });
    }
  }

  Sale.init({
    invoiceId: DataTypes.STRING,
    totalAmount: DataTypes.DECIMAL,
    tax: DataTypes.DECIMAL,
    paymentMethod: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Sale',
  });

  return Sale;
};