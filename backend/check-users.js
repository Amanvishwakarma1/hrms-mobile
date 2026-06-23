const sequelize = require('./config/database');
const User = require('./models/User');

async function check() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role'] });
    console.log('Users in database:', JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Failed to query users:', error);
    process.exit(1);
  }
}
check();
