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
    active_membership_status: DataTypes.BOOLEAN,
    email: DataTypes.STRING,
    email_verified: DataTypes.BOOLEAN,
    fname: DataTypes.STRING,
    lname: DataTypes.STRING,
    password: DataTypes.STRING,
    stripeCustomerId: DataTypes.STRING,
    userImg: DataTypes.STRING,
    company: DataTypes.STRING,
    street: DataTypes.TEXT,
    postalNum: DataTypes.STRING,
    country: DataTypes.STRING,
    ustId: DataTypes.INTEGER,
    number: DataTypes.STRING,
    city: DataTypes.STRING,
    role: DataTypes.INTEGER,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    pause_date: DataTypes.DATEONLY,
    cancel_date: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Users',
    paranoid: true,
    deletedAt: "soft_delete",
  });
  return User;
};