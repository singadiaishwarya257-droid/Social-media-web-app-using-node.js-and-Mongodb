const sendResponse = (res, statusCode, success, data = null, error = null) => {
  return res.status(statusCode).json({
    success,
    data,
    error,
  });
};

module.exports = { sendResponse };
