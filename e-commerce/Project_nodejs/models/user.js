'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.UserRole, {
        foreignKey: 'userId',
        as: 'userRoles'
      });
      User.hasMany(models.Order, {
        foreignKey: 'userId',
        as: 'orders'
      });
      User.hasMany(models.Sale, {
        foreignKey: 'userId',
        as: 'sales'
      });
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.TEXT,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};