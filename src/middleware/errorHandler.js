const { sendResponse } = require('../utils/apiResponse');

const notFound = (req, res, next) => {
  return sendResponse(res, 404, false, null, `Route not found: ${req.originalUrl}`);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error('Error caught by global handler:', err);

  return sendResponse(res, statusCode, false, null, message);
};

module.exports = { notFound, errorHandler };
