import { Sequelize, DataTypes } from 'sequelize';

const createInstance = () =>
  new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      dialect: 'postgres',
      logging: true,
    }
  );

const sequelize =
  process.env.NODE_ENV === 'production'
    ? createInstance()
    : (global._sequelize ?? (global._sequelize = createInstance()));



export const Subject = sequelize.define(
  'Subject',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.TEXT },
    backgroundImage: { type: DataTypes.STRING(500) },
  },
  { tableName: 'subjects', schema: 'education_management' }
);

export const Teacher = sequelize.define(
  'Teacher',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: { type: DataTypes.STRING(100), allowNull: false },
    lastName: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(200), allowNull: false },
    phone: { type: DataTypes.STRING(50) },
    gender: { type: DataTypes.ENUM('male', 'female', 'other'), allowNull: false },
    subjectId: { type: DataTypes.INTEGER },
  },
  { tableName: 'teachers', schema: 'education_management' }
);

export const Class = sequelize.define(
  'Class',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    grade: { type: DataTypes.INTEGER, allowNull: false },
    section: { type: DataTypes.STRING(10) },
    teacherId: { type: DataTypes.INTEGER },
  },
  { tableName: 'classes', schema: 'education_management' }
);

export const Student = sequelize.define(
  'Student',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: { type: DataTypes.STRING(100), allowNull: false },
    lastName: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(200) },
    phone: { type: DataTypes.STRING(50) },
    birthDate: { type: DataTypes.DATEONLY },
    gender: { type: DataTypes.ENUM('male', 'female', 'other'), allowNull: false },
    classId: { type: DataTypes.INTEGER },
  },
  { tableName: 'students', schema: 'education_management' }
);

export const Grade = sequelize.define(
  'Grade',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    studentId: { type: DataTypes.INTEGER, allowNull: false },
    subjectId: { type: DataTypes.INTEGER, allowNull: false },
    score: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    maxScore: { type: DataTypes.DECIMAL(5, 2), defaultValue: 100 },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    notes: { type: DataTypes.TEXT },
  },
  { tableName: 'grades', schema: 'education_management' }
);

export const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: { type: DataTypes.STRING(100), allowNull: false },
    lastName: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(200), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.STRING(20), defaultValue: 'admin' },
  },
  { tableName: 'users', schema: 'education_management' }
);

export const Notification = sequelize.define(
  'Notification',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    title: { type: DataTypes.STRING(200), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    type: { type: DataTypes.ENUM('info', 'success', 'warning', 'error'), defaultValue: 'info' },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: 'notifications', schema: 'education_management' }
);



Teacher.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });
Subject.hasMany(Teacher, { foreignKey: 'subjectId', as: 'teachers' });

Class.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' });
Teacher.hasMany(Class, { foreignKey: 'teacherId', as: 'classes' });

Student.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
Class.hasMany(Student, { foreignKey: 'classId', as: 'students' });

Grade.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
Student.hasMany(Grade, { foreignKey: 'studentId', as: 'grades' });

Grade.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });
Subject.hasMany(Grade, { foreignKey: 'subjectId', as: 'grades' });

Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });



let syncPromise = null;
export const syncDB = async () => {
  if (!syncPromise) {
    syncPromise = sequelize.sync({ alter: true });
  }
  await syncPromise;
};

export default sequelize;
