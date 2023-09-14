'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Neworder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Neworder.init({
    uId: DataTypes.INTEGER,
    ordername: DataTypes.STRING,
    orderart: DataTypes.STRING,
    orderpriority: DataTypes.INTEGER,
    orderfile: DataTypes.STRING,
    orderdetail: DataTypes.TEXT,
    orderstatus: DataTypes.INTEGER,
    update_status: DataTypes.BOOLEAN,
    update_status_admin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Orders',
    paranoid: true,
    deletedAt: "soft_delete",
  });
  return Neworder;
};