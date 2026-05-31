'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn({ tableName: 'subjects', schema: 'education_management' }, 'backgroundImage', {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn({ tableName: 'subjects', schema: 'education_management' }, 'backgroundImage');
  }
};
