const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const authMiddleware = require('../middleware/auth');

// Middleware to verify admin role
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Forbidden: Admin access only' });
};

// Protect all admin routes
router.use(authMiddleware, requireAdmin);

router.get('/expenses', adminController.getAllExpenses);
router.put('/expenses/:id/status', adminController.updateExpenseStatus);
router.get('/attendance/live', adminController.getLiveAttendance);

module.exports = router;
