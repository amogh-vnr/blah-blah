const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token (for local auth)
const generateToken = (id) => {
  return jwt.sign({ sub: id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    user = await User.create({ name, email, password });
    
    const token = generateToken(user._id);
    res.status(201).json({ success: true, token, user });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.status(200).json({ success: true, token, user });
  } catch (error) {
    next(error);
  }
};

exports.googleLogin = async (req, res, next) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ success: false, message: 'Please provide a google credential' });

  try {
    const decoded = jwt.decode(credential);
    if (!decoded || !decoded.email) return res.status(400).json({ success: false, message: 'Invalid google credential' });

    let user = await User.findOne({ email: decoded.email });
    if (!user) {
      user = await User.create({
        googleId: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture
      });
    } else if (!user.googleId) {
      // Link google account to existing email
      user.googleId = decoded.sub;
      user.picture = decoded.picture;
      await user.save();
    }

    const token = generateToken(user._id);
    res.status(200).json({ success: true, token, user });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  res.status(200).json({ success: true, data: req.user });
};
