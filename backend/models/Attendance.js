const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  checkIn: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  checkOut: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  workingHours: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  coords: {
    type: DataTypes.JSON,
    allowNull: true,
  }
}, {
  timestamps: true,
  tableName: 'Attendances', // Specify table name explicitly
});

module.exports = Attendance;
