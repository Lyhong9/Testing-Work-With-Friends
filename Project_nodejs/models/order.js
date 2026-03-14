'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.Customer, {
        foreignKey: 'customerID',
        as: 'customer'
      });
      Order.hasMany(models.OrderItem, {
        foreignKey: 'orderID',
        as: 'orderItems'
      });
      Order.hasOne(models.Payment, {
        foreignKey: 'orderID',
        as: 'payment'
      });
    }
  }
  Order.init({
    customerID: DataTypes.INTEGER,
    orderDate: DataTypes.DATE,
    status: DataTypes.STRING,
    orderAmount: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};