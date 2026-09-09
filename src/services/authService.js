const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

const registerUser = async ({ username, email, password, fullName, bio }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw Object.assign(new Error('User already exists with this email'), { statusCode: 400 });
  }

  const user = await User.create({ username, email, password, fullName, bio });

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

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw Object.assign(new Error('Invalid credentials'), { statusCode: 400 });
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    throw Object.assign(new Error('Invalid credentials'), { statusCode: 400 });
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

module.exports = { registerUser, loginUser };
