'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class email_template extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  email_template.init({
    email_type: DataTypes.TEXT,
    email_title:DataTypes.TEXT,
    email_content: DataTypes.TEXT,
    header: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'email_template',
  });
  return email_template;
};