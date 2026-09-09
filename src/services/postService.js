const Post = require('../models/Post');
const Comment = require('../models/Comment');

const createPost = async ({ userId, content, imageUrl }) => {
  const post = await Post.create({
    user: userId,
    content,
    imageUrl,
  });

  return post;
};

const getAllPosts = async () => {
  return Post.find({})
    .populate('user', 'username fullName avatar')
    .sort({ createdAt: -1 })
    .lean();
};

const getSinglePost = async (postId) => {
  return Post.findById(postId)
    .populate('user', 'username fullName avatar')
    .lean();
};

const updatePost = async (postId, userId, payload) => {
  const post = await Post.findOne({ _id: postId, user: userId });

  if (!post) {
    throw Object.assign(new Error('Post not found or unauthorized'), { statusCode: 404 });
  }

  if (payload.content) post.content = payload.content;
  if (payload.imageUrl) post.imageUrl = payload.imageUrl;

  await post.save();
  return post;
};

const deletePost = async (postId, userId) => {
  const post = await Post.findOne({ _id: postId, user: userId });

  if (!post) {
    throw Object.assign(new Error('Post not found or unauthorized'), { statusCode: 403 });
  }

  await Comment.deleteMany({ post: postId });
  await post.deleteOne();

  return true;
};

module.exports = {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
};
