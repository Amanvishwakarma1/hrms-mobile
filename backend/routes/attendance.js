const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance');
const authMiddleware = require('../middleware/auth');

// Protect all attendance routes with auth middleware
router.use(authMiddleware);

router.post('/clock-in', attendanceController.clockIn);
router.post('/clock-out', attendanceController.clockOut);
router.get('/history', attendanceController.getHistory);

module.exports = router;
