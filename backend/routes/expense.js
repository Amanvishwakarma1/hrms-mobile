const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', expenseController.getAllExpenses);
router.post('/', upload.single('file'), expenseController.createExpenseClaim);

module.exports = router;