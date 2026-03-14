'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Category,{
        foreignKey: 'categoryID',
        as: "category"
      });
      Product.belongsTo(models.Brand,{
        foreignKey: 'brandID',
        as: "brand"
      });
      Product.hasMany(models.OrderItem, {
        foreignKey: 'productID',
        as: 'orderItems'
      });
      Product.hasMany(models.Review, {
        foreignKey: 'productID',
        as: 'reviews'
      });
      Product.hasMany(models.SaleItemDetail, {
        foreignKey: 'productID',
        as: 'saleItemDetails'
      });
    }
  }
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    stockQuantity: DataTypes.INTEGER,
    categoryID: DataTypes.INTEGER,
    brandID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};