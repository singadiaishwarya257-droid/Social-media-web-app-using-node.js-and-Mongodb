const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

const createUser = async ({ username, email, password, fullName, bio }) => {
  const user = await User.create({
    username,
    email,
    password,
    fullName,
    bio,
  });

  return {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      bio: user.bio,
      createdAt: user.createdAt,
    },
    token: generateToken(user._id),
  };
};

const getUserById = async (id) => {
  return User.findById(id).select('-password').lean();
};

const getUserProfile = async (id) => {
  return User.findById(id).select('-password').lean();
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw Object.assign(new Error('Invalid email or password'), { statusCode: 400 });
  }

  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) {
    throw Object.assign(new Error('Invalid email or password'), { statusCode: 400 });
  }

  return {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      bio: user.bio,
    },
    token: generateToken(user._id),
  };
};

module.exports = {
  createUser,
  getUserById,
  getUserProfile,
  loginUser,
};
