'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order_Comment.init({
    user_id: DataTypes.INTEGER,
    order_id: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    files:DataTypes.TEXT,
    files_original_name: DataTypes.TEXT,
    role: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order_Comment',
  });
  return Order_Comment;
};