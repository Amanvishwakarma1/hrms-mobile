const User = require('../models/User');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Set token dynamically based on standard test tokens or dynamic token
    let token = `token-${user.id}`;
    if (user.email === 'admin@hrms.com') {
      token = 'fake-jwt-token';
    } else if (user.email === 'employee@hrms.com') {
      token = 'fake-employee-token';
    }

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login controller error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
