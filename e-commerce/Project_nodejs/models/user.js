'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Sale, { foreignKey: "userId", as: "sales" });
      // User.hasMany(models.Order, { foreignKey: "userId", as: "orders" });
      User.hasMany(models.UserRole, { foreignKey: "userId", as: "userRoles" });
      User.belongsToMany(models.Role, {
        through: models.UserRole,
        foreignKey: "userId",
        as: "roles",
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