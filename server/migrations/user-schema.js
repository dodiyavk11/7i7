
'use strict';
const JsonField = require('sequelize-json');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      active_membership_status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      fname: {
        type: Sequelize.STRING,
      },
      lname: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING
      },
      stripeCustomerId: {
        type: Sequelize.STRING
      },
      userImg: {
        type: Sequelize.STRING
      },
      company: {
        type: Sequelize.STRING
      },
      street: {
        type: Sequelize.TEXT
      },
      postalNum: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      ustId: {
        type: Sequelize.INTEGER
      },
      number: {
        type: Sequelize.BIGINT,
      },
      city: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      start_date: {
        type: Sequelize.DATEONLY
      },
      end_date: {
        type: Sequelize.DATEONLY
      },
      pause_date: {
        type: Sequelize.DATEONLY
      },
      cancel_date: {
        type: Sequelize.DATEONLY
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
    await queryInterface.dropTable('Users');
  }
};