'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Customer.hasMany(models.Address, {
        foreignKey: 'customerID',
        as: 'addresses'
      });
      Customer.hasOne(models.Cart, {
        foreignKey: 'customerID',
        as: 'cart'
      });
      Customer.hasMany(models.Order, {
        foreignKey: 'customerID',
        as: 'orders'
      });
      Customer.hasMany(models.Review, {
        foreignKey: 'customerID',
        as: 'reviews'
      });
    }
  }
  Customer.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};