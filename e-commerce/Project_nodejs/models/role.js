"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.UserRole, { foreignKey: "roleId", as: "userRoles" });
      
      Role.belongsToMany(models.User, {
        through: models.UserRole,
        foreignKey: "roleId",
        as: "users",
      });

      Role.belongsToMany(models.Permission, {
        through: models.RolePermission,
        foreignKey: "roleId",
        as: "permissions",
      });
    }
  }

  Role.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Role",
    },
  );

  return Role;
};
