'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee_Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Employee_Orders.init({
    emp_id: DataTypes.INTEGER,
    order_id: DataTypes.INTEGER,
    customer_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Employee_Orders',
  });
  return Employee_Orders;
};