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
      uId: {
        type: Sequelize.INTEGER
      },
      ordername: {
        type: Sequelize.STRING
      },
      orderart: {
        type: Sequelize.STRING
      },
      orderpriority: {
        type: Sequelize.INTEGER
      },
      orderfile: {
        type: Sequelize.STRING
      },
      orderdetail: {
        type: Sequelize.TEXT
      },
      orderstatus: {
        type: Sequelize.INTEGER
      },
      update_status: {
        type: Sequelize.BOOLEAN
      },
      update_status_admin: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      soft_delete: {
        allowNull: false,
        type: Sequelize.STRING,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};