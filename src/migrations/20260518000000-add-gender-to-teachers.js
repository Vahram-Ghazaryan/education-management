'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('teachers');
    if (!tableInfo.gender) {
      await queryInterface.addColumn('teachers', 'gender', {
        type: Sequelize.ENUM('male', 'female', 'other'),
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('teachers');
    if (tableInfo.gender) {
      await queryInterface.removeColumn('teachers', 'gender');
    }
  }
};
