const sequelize = require('./config/database');

async function run() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connected.');

    console.log('Checking existing columns in Expenses...');
    const [expensesCols] = await sequelize.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'Expenses' AND column_name = 'UserId';
    `);
    
    if (expensesCols.length === 0) {
      console.log('Adding column UserId to Expenses...');
      await sequelize.query('ALTER TABLE "Expenses" ADD COLUMN "UserId" UUID REFERENCES "Users"("id") ON DELETE SET NULL;');
      console.log('Column UserId successfully added to Expenses.');
    } else {
      console.log('Column UserId already exists in Expenses.');
    }

    console.log('Checking existing columns in Attendances...');
    const [attendancesCols] = await sequelize.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'Attendances' AND column_name = 'UserId';
    `);

    if (attendancesCols.length === 0) {
      console.log('Adding column UserId to Attendances...');
      await sequelize.query('ALTER TABLE "Attendances" ADD COLUMN "UserId" UUID REFERENCES "Users"("id") ON DELETE SET NULL;');
      console.log('Column UserId successfully added to Attendances.');
    } else {
      console.log('Column UserId already exists in Attendances.');
    }

    console.log('Verifying Columns in Expenses table...');
    const [expensesFields] = await sequelize.query(`
      SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Expenses';
    `);
    console.log('Expenses columns:', expensesFields);

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

run();
