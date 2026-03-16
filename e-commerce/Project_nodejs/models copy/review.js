'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.Customer, {
        foreignKey: 'customerID',
        as: 'customer'
      });
      Review.belongsTo(models.Product, {
        foreignKey: 'productID',
        as: 'product'
      });
    }
  }
  Review.init({
    customerID: DataTypes.INTEGER,
    productID: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    reviewDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};