'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      { tableName: 'notifications', schema: 'education_management' },
      [
        {
          title: '{"key": "notifications.demo.systemUpdate.title"}',
          message: '{"key": "notifications.demo.systemUpdate.message"}',
          type: 'success',
          isRead: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: '{"key": "notifications.demo.scheduledMaintenance.title"}',
          message: '{"key": "notifications.demo.scheduledMaintenance.message"}',
          type: 'warning',
          isRead: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete({ tableName: 'notifications', schema: 'education_management' }, null, {});
  },
};
