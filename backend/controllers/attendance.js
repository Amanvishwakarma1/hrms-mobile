const Attendance = require('../models/Attendance');

exports.clockIn = async (req, res) => {
  try {
    const { date, checkIn, coords } = req.body;
    if (!date || !checkIn) {
      return res.status(400).json({ error: 'Date and check-in time are required' });
    }

    // Check if user is already clocked in
    const active = await Attendance.findOne({
      where: { UserId: req.user.id, checkOut: null }
    });
    if (active) {
      return res.status(400).json({ error: 'User is already clocked in' });
    }

    const record = await Attendance.create({
      date,
      checkIn,
      coords,
      UserId: req.user.id
    });

    res.status(201).json(record);
  } catch (err) {
    console.error('Clock-in controller error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.clockOut = async (req, res) => {
  try {
    const { checkOut, workingHours, coords } = req.body;
    if (!checkOut) {
      return res.status(400).json({ error: 'Check-out time is required' });
    }

    const record = await Attendance.findOne({
      where: { UserId: req.user.id, checkOut: null }
    });

    if (!record) {
      return res.status(400).json({ error: 'No active clock-in session found' });
    }

    record.checkOut = checkOut;
    record.workingHours = workingHours || '00:00:00';
    if (coords) {
      record.coords = coords;
    }
    await record.save();

    res.json(record);
  } catch (err) {
    console.error('Clock-out controller error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const records = await Attendance.findAll({
      where: { UserId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(records);
  } catch (err) {
    console.error('Get history controller error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
