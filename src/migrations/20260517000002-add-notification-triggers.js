'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION notify_new_grade()
      RETURNS TRIGGER AS $$
      DECLARE
          student_name TEXT;
          subject_name TEXT;
      BEGIN
          -- Get student name
          SELECT "firstName" || ' ' || "lastName" INTO student_name
          FROM students WHERE id = NEW."studentId";
          
          -- Get subject name
          SELECT name INTO subject_name
          FROM subjects WHERE id = NEW."subjectId";

          INSERT INTO notifications ("userId", title, message, type, "isRead", "createdAt", "updatedAt")
          VALUES (
              NULL, -- NULL means global notification or we could target a specific user if needed
              '{"key": "notifications.newGrade.title"}',
              json_build_object(
                  'key', 'notifications.newGrade.message',
                  'params', json_build_object(
                      'score', NEW.score,
                      'student', student_name,
                      'subject', subject_name
                  )
              )::text,
              'info',
              false,
              NOW(),
              NOW()
          );
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trigger_notify_new_grade ON grades;
      CREATE TRIGGER trigger_notify_new_grade
      AFTER INSERT ON grades
      FOR EACH ROW
      EXECUTE FUNCTION notify_new_grade();
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS trigger_notify_new_grade ON grades;`);
    await queryInterface.sequelize.query(`DROP FUNCTION IF EXISTS notify_new_grade;`);
  },
};
