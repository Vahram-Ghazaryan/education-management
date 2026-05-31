'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable({ tableName: 'teachers', schema: 'education_management' });
    if (!tableInfo.gender) {
      await queryInterface.addColumn({ tableName: 'teachers', schema: 'education_management' }, 'gender', {
        type: Sequelize.ENUM('male', 'female', 'other'),
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable({ tableName: 'teachers', schema: 'education_management' });
    if (tableInfo.gender) {
      await queryInterface.removeColumn({ tableName: 'teachers', schema: 'education_management' }, 'gender');
    }
  }
};
