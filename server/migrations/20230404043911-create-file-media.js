'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('file_media', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderid:{
        type:Sequelize.INTEGER
      },
      file: {
        type: Sequelize.STRING
      },
      orignam_name: {
        type: Sequelize.STRING
      },
      isLink: {
        type: Sequelize.BOOLEAN
      },
       link:{
        type: Sequelize.STRING
      },
       link_name:{
        type: Sequelize.STRING
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
    await queryInterface.dropTable('file_media');
  }
};