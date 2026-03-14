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
        foreignKey: 'sale_id',
        as: 'saleItemDetails'
      });
    }
  }
  Sale.init({
    sale_id: DataTypes.STRING,
    invoice_id: DataTypes.STRING,
    sale_date: DataTypes.DATE,
    amount: DataTypes.DOUBLE,
    sub_total: DataTypes.DOUBLE,
    tax: DataTypes.DECIMAL,
    pay_method: DataTypes.STRING,
    create_by: DataTypes.STRING,
    created_on: DataTypes.DATE,
    changed_by: DataTypes.STRING,
    changed_on: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Sale',
  });
  return Sale;
};