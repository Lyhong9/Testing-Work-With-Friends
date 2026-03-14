'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StoreInfor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StoreInfor.init({
    store_name: DataTypes.STRING,
    email: DataTypes.STRING,
    website: DataTypes.STRING,
    logo: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'StoreInfor',
  });
  return StoreInfor;
};