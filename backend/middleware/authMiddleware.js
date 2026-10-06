const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    // For prototype, we use jwt.decode instead of jwt.verify because the token is from Google OAuth
    // In production with a real backend JWT, use jwt.verify(token, process.env.JWT_SECRET)
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.sub) {
      return res.status(401).json({ success: false, message: 'Invalid token payload' });
    }

    req.user = await User.findOne({ googleId: decoded.sub });
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found in system' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

module.exports = { protect };
