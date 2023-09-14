'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    userImg:DataTypes.STRING,
    company: DataTypes.STRING,
    street: DataTypes.TEXT,
    postalNum: DataTypes.STRING,
    country: DataTypes.STRING,
    ustId: DataTypes.INTEGER,
    number: DataTypes.STRING,
    city: DataTypes.STRING,
    paymentStripe: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Users',
  });
  return User;
};