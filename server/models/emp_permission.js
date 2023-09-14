'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Emp_Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Emp_Permission.init({
    emp_id: DataTypes.INTEGER,
    permission: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Emp_Permission',
  });
  return Emp_Permission;
};