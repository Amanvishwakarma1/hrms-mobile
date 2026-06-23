const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sequelize = require('./config/database');

// Import Models to establish relationships
const User = require('./models/User');
const Expense = require('./models/Expense');
const Attendance = require('./models/Attendance');

// Establish associations
User.hasMany(Expense, { onDelete: 'CASCADE' });
Expense.belongsTo(User);

User.hasMany(Attendance, { onDelete: 'CASCADE' });
Attendance.belongsTo(User);

// Import Routes
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expense');
const attendanceRoutes = require('./routes/attendance');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 8000;

// Essential for running behind GitHub's reverse proxy structure
app.set('trust proxy', 1);

// FIXED CORS: When withCredentials is true, origin CANNOT be '*'
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl) or any origin in development
        callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Crucial for matching the frontend axios configuration
}));

// Explicit fallback headers configuration
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
        res.header('Access-Control-Allow-Origin', origin); // Mirrors back the exact frontend origin
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true'); // Must be explicit
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Synchronize verification context on file preservation system directories
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

app.use('/static/uploads', express.static(uploadDir));

// Route mappings
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/admin', adminRoutes);

// Seed function to create default users if the DB is empty
const seedUsers = async () => {
  const count = await User.count();
  if (count === 0) {
    console.log('--- Seeding default users into the database ---');
    await User.bulkCreate([
      {
        name: 'Admin User',
        email: 'admin@hrms.com',
        password: 'password123',
        role: 'admin'
      },
      {
        name: 'Employee User',
        email: 'employee@hrms.com',
        password: 'password123',
        role: 'employee'
      }
    ]);
    console.log('--- Seeding completed successfully ---');
  }
};

// Database Layer Connection Lifecycle Verification
sequelize.sync({ force: false })
  .then(async () => {
    console.log('PostgreSQL architecture connected and mapped via Sequelize ORM smoothly.');
    
    // Seed default users
    await seedUsers();
    
    // Switch to local standard host binding to bypass internal Codespaces proxy mismatches
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server executing active connection interface protocols across port: ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Critical database initialization fault mapped:', err);
  });