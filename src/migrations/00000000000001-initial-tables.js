'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const schema = 'education_management';

    await queryInterface.createTable({ tableName: 'subjects', schema }, {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(200), allowNull: false },
      description: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable({ tableName: 'teachers', schema }, {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      firstName: { type: Sequelize.STRING(100), allowNull: false },
      lastName: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING(200), allowNull: false },
      phone: { type: Sequelize.STRING(50) },
      subjectId: { type: Sequelize.INTEGER, references: { model: { tableName: 'subjects', schema }, key: 'id' } },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable({ tableName: 'classes', schema }, {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      grade: { type: Sequelize.INTEGER, allowNull: false },
      section: { type: Sequelize.STRING(10) },
      teacherId: { type: Sequelize.INTEGER, references: { model: { tableName: 'teachers', schema }, key: 'id' } },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable({ tableName: 'students', schema }, {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      firstName: { type: Sequelize.STRING(100), allowNull: false },
      lastName: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING(200) },
      phone: { type: Sequelize.STRING(50) },
      birthDate: { type: Sequelize.DATEONLY },
      gender: { type: Sequelize.ENUM('male', 'female', 'other'), allowNull: false },
      classId: { type: Sequelize.INTEGER, references: { model: { tableName: 'classes', schema }, key: 'id' } },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable({ tableName: 'grades', schema }, {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      studentId: { type: Sequelize.INTEGER, allowNull: false, references: { model: { tableName: 'students', schema }, key: 'id' } },
      subjectId: { type: Sequelize.INTEGER, allowNull: false, references: { model: { tableName: 'subjects', schema }, key: 'id' } },
      score: { type: Sequelize.DECIMAL(5, 2), allowNull: false },
      maxScore: { type: Sequelize.DECIMAL(5, 2), defaultValue: 100 },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      notes: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable({ tableName: 'users', schema }, {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      firstName: { type: Sequelize.STRING(100), allowNull: false },
      lastName: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING(200), allowNull: false, unique: true },
      password: { type: Sequelize.STRING(255), allowNull: false },
      role: { type: Sequelize.STRING(20), defaultValue: 'admin' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  down: async (queryInterface, Sequelize) => {
    const schema = 'education_management';
    await queryInterface.dropTable({ tableName: 'grades', schema });
    await queryInterface.dropTable({ tableName: 'students', schema });
    await queryInterface.dropTable({ tableName: 'classes', schema });
    await queryInterface.dropTable({ tableName: 'teachers', schema });
    await queryInterface.dropTable({ tableName: 'subjects', schema });
    await queryInterface.dropTable({ tableName: 'users', schema });
  }
};
