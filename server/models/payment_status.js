'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payment_status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  payment_status.init({
    uId: DataTypes.INTEGER,
    transaction_id: DataTypes.STRING,
    transaction_status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'payment_status',
  });
  return payment_status;
};