const Comment = require('../models/Comment');
const Post = require('../models/Post');

const createComment = async ({ postId, userId, content }) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw Object.assign(new Error('Post not found'), { statusCode: 404 });
  }

  const comment = await Comment.create({
    post: postId,
    user: userId,
    content,
  });

  post.commentsCount += 1;
  await post.save();

  return comment;
};

const getCommentsByPost = async (postId) => {
  return Comment.find({ post: postId })
    .populate('user', 'username fullName avatar')
    .sort({ createdAt: -1 })
    .lean();
};

const deleteComment = async (commentId, userId) => {
  const comment = await Comment.findOne({ _id: commentId, user: userId });

  if (!comment) {
    throw Object.assign(new Error('Comment not found or unauthorized'), { statusCode: 403 });
  }

  await comment.deleteOne();

  await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });

  return true;
};

module.exports = {
  createComment,
  getCommentsByPost,
  deleteComment,
};
