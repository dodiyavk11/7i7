'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class messages_template extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  messages_template.init({
    email_type: DataTypes.TEXT,
    msg_title:DataTypes.TEXT,
    msg_content: DataTypes.TEXT,
    header: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'messages_template',
  });
  return messages_template;
};