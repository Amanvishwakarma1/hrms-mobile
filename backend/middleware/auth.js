const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header required (e.g. Bearer <token>)' });
    }

    const token = authHeader.split(' ')[1];
    let user = null;

    if (token === 'fake-jwt-token') {
      user = await User.findOne({ where: { email: 'admin@hrms.com' } });
    } else if (token === 'fake-employee-token') {
      user = await User.findOne({ where: { email: 'employee@hrms.com' } });
    } else if (token.startsWith('token-')) {
      const userId = token.split('token-')[1];
      user = await User.findByPk(userId);
    } else {
      // Fallback: check if the token is a direct UUID of a user
      user = await User.findByPk(token);
    }

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ error: 'Internal Server Error in authentication' });
  }
};
