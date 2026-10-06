const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.googleLogin = async (req, res, next) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ success: false, message: 'Please provide a google credential' });
  }

  try {
    const decoded = jwt.decode(credential);
    if (!decoded || !decoded.sub) {
      return res.status(400).json({ success: false, message: 'Invalid google credential' });
    }

    let user = await User.findOne({ googleId: decoded.sub });
    if (!user) {
      user = await User.create({
        googleId: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture
      });
    }

    res.status(200).json({
      success: true,
      token: credential, // using the google token directly for this prototype
      user
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
};
