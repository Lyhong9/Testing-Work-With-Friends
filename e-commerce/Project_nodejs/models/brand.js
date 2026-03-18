"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Brand.hasMany(models.Product, {
        foreignKey: "brandId",
        as: "products",
      });
      // Brand.belongsTo(models.Category, {
      //   foreignKey: "category_id",
      //   as: "category",
      // });
    }
  }
  Brand.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      description: DataTypes.TEXT,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Brand",
    },
  );
  return Brand;
};
