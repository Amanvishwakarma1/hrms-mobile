const sequelize = require('./config/database');
const User = require('./models/User');
const Expense = require('./models/Expense');
const Attendance = require('./models/Attendance');

// Re-establish associations to ensure Sequelize builds the foreign keys
User.hasMany(Expense, { onDelete: 'CASCADE' });
Expense.belongsTo(User);

User.hasMany(Attendance, { onDelete: 'CASCADE' });
Attendance.belongsTo(User);

async function alterDb() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connection established successfully.');

    console.log('Synchronizing schema with { alter: true } to create/add missing columns...');
    await sequelize.sync({ alter: true });
    console.log('Schema synchronized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to update DB schema:', error);
    process.exit(1);
  }
}

alterDb();
