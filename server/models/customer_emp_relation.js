'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customer_emp_relations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  customer_emp_relations.init({
    emp_id: DataTypes.INTEGER,
    customer_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'customer_emp_relations',
  });
  return customer_emp_relations;
};