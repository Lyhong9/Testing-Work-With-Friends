'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
      Product.belongsTo(models.Brand, { foreignKey: 'brandId', as: 'brand' });
      Product.hasMany(models.OrderItem, { foreignKey: 'productId', as: 'orderItems' });
      Product.hasMany(models.Review, { foreignKey: 'productId', as: 'reviews' });
      Product.hasMany(models.SaleItem, { foreignKey: 'productId', as: 'saleItems' });
    }
  }

  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    stockQuantity: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    brandId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });

  return Product;
};