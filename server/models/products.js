'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Products.init(
    {
      product_name: DataTypes.STRING,
      price: DataTypes.DOUBLE,
      description: DataTypes.STRING,
      stripe_product_id: DataTypes.STRING,
      stripe_price_id: DataTypes.STRING
    }, {
    sequelize,
    paranoid: true,
    deletedAt: "soft_delete",
    modelName: 'Products',
  });
  return Products;
};