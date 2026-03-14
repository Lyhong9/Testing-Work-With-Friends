'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Telegram extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Telegram.init({
    tel_id: DataTypes.STRING,
    token: DataTypes.TEXT,
    group_id: DataTypes.STRING,
    status: DataTypes.STRING,
    is_alert: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Telegram',
  });
  return Telegram;
};