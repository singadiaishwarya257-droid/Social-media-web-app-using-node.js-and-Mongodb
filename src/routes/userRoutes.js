const express = require('express');
const { registerUser, login, getProfile, logout } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/asyncHandler');

const router = express.Router();

router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.get('/me', protect, asyncHandler(getProfile));

module.exports = router;
