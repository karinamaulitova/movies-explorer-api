const INTERNAL_SERVER_ERROR = require('../utils/error-codes');

module.exports = (err, req, res, next) => {
  res
    .status(err.statusCode || INTERNAL_SERVER_ERROR)
    .send({ message: err.message });
  next();
};
