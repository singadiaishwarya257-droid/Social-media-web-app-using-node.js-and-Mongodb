const express = require('express');
const { createComment, getCommentsForPost, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/asyncHandler');

const router = express.Router();

router.route('/post/:postId')
  .get(asyncHandler(getCommentsForPost))
  .post(protect, asyncHandler(createComment));

router.delete('/:id', protect, asyncHandler(deleteComment));

module.exports = router;
