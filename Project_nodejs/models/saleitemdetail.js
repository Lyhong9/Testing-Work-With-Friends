'use strict';
const { Model } = require('sequelize');
const sale = require('./sale');
module.exports = (sequelize, DataTypes) => {
  class SaleItemDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SaleItemDetail.belongsTo(models.Sale, {
        foreignKey: 'sale_id',
        targetKey: 'sale_id',
        as: 'sale',
      });
      SaleItemDetail.belongsTo(models.Product, {
        foreignKey: 'productID',
        as: 'product',
      });
    }
  }
  SaleItemDetail.init(
    {
      std_id: DataTypes.STRING,
      sale_id: DataTypes.STRING,
      prd_id: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
      price: DataTypes.DOUBLE,
      create_by: DataTypes.STRING,
      created_on: DataTypes.DATE,
      changed_by: DataTypes.STRING,
      changed_on: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'SaleItemDetail',
    },
  );
  return SaleItemDetail;
};
