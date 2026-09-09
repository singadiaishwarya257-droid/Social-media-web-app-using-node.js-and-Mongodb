const { sendResponse } = require('../utils/apiResponse');

const authorizeOwner = (resourceOwnerField = 'user') => {
  return (req, res, next) => {
    const currentUserId = req.user?._id?.toString();
    const resourceOwnerId = req.resource?.[resourceOwnerField]?.toString?.() ?? req.resource?.user?.toString?.();

    if (!currentUserId || !resourceOwnerId) {
      return sendResponse(res, 403, false, null, 'Forbidden: cannot verify ownership');
    }

    if (currentUserId !== resourceOwnerId) {
      return sendResponse(res, 403, false, null, 'Forbidden: you cannot perform this action on another user resource');
    }

    next();
  };
};

module.exports = { authorizeOwner };
