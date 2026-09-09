const { eventBus } = require('./eventBus');

const registerAppEvents = () => {
  eventBus.on('user.created', (user) => {
    console.log(`User CREATED event fired for: ${user.email}`);
  });

  eventBus.on('post.created', (post) => {
    console.log(`Post CREATED event fired for post: ${post._id}`);
  });

  eventBus.on('comment.created', (comment) => {
    console.log(`Comment CREATED event fired for comment: ${comment._id}`);
  });
};

module.exports = { registerAppEvents };
