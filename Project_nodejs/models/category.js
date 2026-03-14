'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.hasMany(models.Product, {
        foreignKey: 'categoryID',
        as: 'products'
      });
      Category.hasMany(models.Brand,{
         foreignKey: 'category_id',
        as: 'brand'
      })
    }
  }
  Category.init({
    name: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};