const Expense = require('../models/Expense');
const User = require('../models/User');
const Attendance = require('../models/Attendance');

exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      include: [{
        model: User,
        attributes: ['name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(expenses);
  } catch (err) {
    console.error('Admin get expenses error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateExpenseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense claim not found' });
    }

    expense.status = status;
    await expense.save();

    res.json(expense);
  } catch (err) {
    console.error('Admin update expense error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getLiveAttendance = async (req, res) => {
  try {
    const live = await Attendance.findAll({
      where: { checkOut: null },
      include: [{
        model: User,
        attributes: ['name', 'email']
      }],
      order: [['checkIn', 'ASC']]
    });
    res.json(live);
  } catch (err) {
    console.error('Admin get live attendance error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
