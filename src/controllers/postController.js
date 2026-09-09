const { sendResponse } = require('../utils/apiResponse');
const postService = require('../services/postService');
const { eventBus } = require('../events/eventBus');

const createPost = async (req, res) => {
  try {
    const { content, imageUrl } = req.body;

    if (!content || !content.trim()) {
      return sendResponse(res, 400, false, null, 'Post content is required');
    }

    const post = await postService.createPost({
      userId: req.user._id,
      content,
      imageUrl,
    });

    eventBus.emit('post.created', post);

    return sendResponse(res, 201, true, { post }, null);
  } catch (error) {
    return sendResponse(res, error.statusCode || 500, false, null, error.message || 'Post creation failed');
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    return sendResponse(res, 200, true, { posts }, null);
  } catch (error) {
    return sendResponse(res, error.statusCode || 500, false, null, error.message || 'Failed to fetch posts');
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await postService.getSinglePost(req.params.id);

    if (!post) {
      return sendResponse(res, 404, false, null, 'Post not found');
    }

    return sendResponse(res, 200, true, { post }, null);
  } catch (error) {
    return sendResponse(res, error.statusCode || 500, false, null, error.message || 'Failed to fetch post');
  }
};

const updatePost = async (req, res) => {
  try {
    const { content, imageUrl } = req.body;

    if (!content && !imageUrl) {
      return sendResponse(res, 400, false, null, 'At least one field is required for update');
    }

    const updatedPost = await postService.updatePost(req.params.id, req.user._id, { content, imageUrl });
    return sendResponse(res, 200, true, { post: updatedPost }, null);
  } catch (error) {
    return sendResponse(res, error.statusCode || 500, false, null, error.message || 'Post update failed');
  }
};

const deletePost = async (req, res) => {
  try {
    await postService.deletePost(req.params.id, req.user._id);
    return sendResponse(res, 200, true, { message: 'Post deleted successfully' }, null);
  } catch (error) {
    return sendResponse(res, error.statusCode || 500, false, null, error.message || 'Post deletion failed');
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};
