'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class file_media extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  file_media.init({
    orderid:DataTypes.INTEGER,
    file: DataTypes.STRING,
    orignal_name:DataTypes.STRING,
    isLink: DataTypes.BOOLEAN,
    link: DataTypes.STRING,
    link_name: DataTypes.STRING

  }, {
    sequelize,
    modelName: 'file_media',
  });
  return file_media;
};