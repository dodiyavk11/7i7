'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order_files extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  order_files.init({
    order_id: DataTypes.INTEGER,
    files: DataTypes.STRING,
    orignal_name:DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'order_files',
  });
  return order_files;
};