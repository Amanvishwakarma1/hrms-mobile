const sequelize = require('./config/database');

async function describe() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    
    console.log('Describing Expenses table...');
    const [results] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Expenses';
    `);
    
    console.log('Columns in Expenses table:', JSON.stringify(results, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Failed to describe table:', error);
    process.exit(1);
  }
}

describe();
