'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Events extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Events.init({
    date: DataTypes.STRING,
    eventname: DataTypes.STRING,
    cost: DataTypes.STRING,
    eventdetail: DataTypes.TEXT,
  }, {
    sequelize,
    paranoid:true,
    deletedAt:"soft_delete",
    modelName: 'Events',
  });
  return Events;
};