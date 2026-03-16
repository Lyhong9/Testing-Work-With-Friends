"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Sale, { foreignKey: "saleId", as: "sale" });
      Payment.belongsTo(models.Order, { foreignKey: "orderId", as: "order" });
    }
  }

  Payment.init(
    {
      saleId: DataTypes.INTEGER,
      orderId: DataTypes.INTEGER,
      amount: DataTypes.DECIMAL,
      method: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Payment",
    },
  );

  return Payment;
};
