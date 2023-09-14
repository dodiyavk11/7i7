'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_Subs_Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User_Subs_Product.init({
    user_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    subs_status: DataTypes.INTEGER,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    pause_date: DataTypes.DATEONLY,
    cancel_date: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'User_Subs_Product',
  });
  return User_Subs_Product;
};