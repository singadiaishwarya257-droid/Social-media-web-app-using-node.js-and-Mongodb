const User = require('../models/User');
const { sendResponse } = require('../utils/apiResponse');
const { createUser, getUserProfile, loginUser } = require('../services/userService');
const { eventBus } = require('../events/eventBus');

const registerUser = async (req, res) => {
  try {
    const { username, email, password, fullName, bio } = req.body;

    if (!username || !email || !password) {
      return sendResponse(res, 400, false, null, 'Username, email and password are required');
    }

    const result = await createUser({ username, email, password, fullName, bio });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie('auth_token', result.token, cookieOptions);
    eventBus.emit('user.created', result.user);

    return sendResponse(res, 201, true, { user: result.user }, null);
  } catch (error) {
    return sendResponse(res, error.statusCode || 500, false, null, error.message || 'Registration failed');
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, 400, false, null, 'Email and password are required');
    }

    const result = await loginUser({ email, password });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie('auth_token', result.token, cookieOptions);

    return sendResponse(res, 200, true, { user: result.user }, null);
  } catch (error) {
    return sendResponse(res, error.statusCode || 500, false, null, error.message || 'Login failed');
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await getUserProfile(req.user._id);

    return sendResponse(res, 200, true, { profile }, null);
  } catch (error) {
    return sendResponse(res, error.statusCode || 500, false, null, error.message || 'Profile fetch failed');
  }
};

const logout = async (req, res) => {
  res.clearCookie('auth_token');
  return sendResponse(res, 200, true, { message: 'Logged out successfully' }, null);
};

module.exports = {
  registerUser,
  login,
  getProfile,
  logout,
};
