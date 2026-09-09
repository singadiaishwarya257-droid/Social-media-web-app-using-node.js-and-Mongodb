const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendResponse } = require('../utils/apiResponse');

// Protect sensitive endpoints by validating the JWT stored in an HTTP-only cookie.
const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.auth_token;

    if (!token) {
      return sendResponse(res, 401, false, null, 'Unauthorized: missing JWT token');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change_this_secret_in_production');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return sendResponse(res, 401, false, null, 'Unauthorized: user no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    return sendResponse(res, 401, false, null, 'Unauthorized: invalid or expired token');
  }
};

module.exports = { protect };
