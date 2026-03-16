'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Sale.hasMany(models.SaleItemDetail, {
        foreignKey: 'saleId',
        as: 'saleItemDetails'
      });
      Sale.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      Sale.belongsTo(models.Payment, {
        foreignKey: 'saleId',
        as: 'payment'
      });
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