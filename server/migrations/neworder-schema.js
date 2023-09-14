'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Neworders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uId:{
        type: Sequelize.INTEGER
      },
      ordername: {
        type: Sequelize.STRING
      },
      orderart: {
        type: Sequelize.STRING
      },
      orderpriority: {
        type: Sequelize.STRING
      },
      orderfile: {
        type: Sequelize.STRING
      },
      orderdetail: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Neworders');
  }
};