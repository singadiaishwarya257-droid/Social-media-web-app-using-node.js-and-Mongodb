const express = require('express');
const Post = require('../models/Post');
const { createPost, getPosts, getPostById, updatePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const { authorizeOwner } = require('../middleware/rbac');
const { asyncHandler } = require('../middleware/asyncHandler');
const { sendResponse } = require('../utils/apiResponse');

const router = express.Router();

const loadPostOwner = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).lean();

    if (!post) {
      return sendResponse(res, 404, false, null, 'Post not found');
    }

    req.resource = { user: post.user };
    next();
  } catch (error) {
    return sendResponse(res, 500, false, null, 'Failed to validate post ownership');
  }
};

router.route('/')
  .get(asyncHandler(getPosts))
  .post(protect, asyncHandler(createPost));

router.route('/:id')
  .get(asyncHandler(getPostById))
  .patch(protect, loadPostOwner, authorizeOwner('user'), asyncHandler(updatePost))
  .delete(protect, loadPostOwner, authorizeOwner('user'), asyncHandler(deletePost));

module.exports = router;
