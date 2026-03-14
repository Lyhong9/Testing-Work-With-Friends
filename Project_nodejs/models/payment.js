'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Payment.belongsTo(models.Order, {
        foreignKey: 'orderID',
        as: 'order'
      });
    }
  }
  Payment.init({
    orderID: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    paymentDate: DataTypes.DATE,
    paymentMethod: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};