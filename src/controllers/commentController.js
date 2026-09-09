const { sendResponse } = require('../utils/apiResponse');
const commentService = require('../services/commentService');
const { eventBus } = require('../events/eventBus');

const createComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return sendResponse(res, 400, false, null, 'Comment content is required');
    }

    const comment = await commentService.createComment({
      postId: req.params.postId,
      userId: req.user._id,
      content,
    });

    eventBus.emit('comment.created', comment);

    return sendResponse(res, 201, true, { comment }, null);
  } catch (error) {
    return sendResponse(res, error.statusCode || 500, false, null, error.message || 'Comment creation failed');
  }
};

const getCommentsForPost = async (req, res) => {
  try {
    const comments = await commentService.getCommentsByPost(req.params.postId);
    return sendResponse(res, 200, true, { comments }, null);
  } catch (error) {
    return sendResponse(res, error.statusCode || 500, false, null, error.message || 'Comments fetch failed');
  }
};

const deleteComment = async (req, res) => {
  try {
    await commentService.deleteComment(req.params.id, req.user._id);
    return sendResponse(res, 200, true, { message: 'Comment deleted successfully' }, null);
  } catch (error) {
    return sendResponse(res, error.statusCode || 500, false, null, error.message || 'Comment deletion failed');
  }
};

module.exports = {
  createComment,
  getCommentsForPost,
  deleteComment,
};
