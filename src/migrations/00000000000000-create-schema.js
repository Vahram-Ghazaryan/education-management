'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createSchema('education_management');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropSchema('education_management');
  }
};
