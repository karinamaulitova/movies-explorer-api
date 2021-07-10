const jwtLib = require('jsonwebtoken');
const UnuathorizedError = require('../errors/unauthorized-err');
const { jwtSecret } = require('../utils/config');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    next(new UnuathorizedError('Необходима авторизация'));
    return;
  }

  let payload;
  try {
    payload = jwtLib.verify(jwt, jwtSecret);
  } catch (err) {
    next(new UnuathorizedError('Необходима авторизация'));
    return;
  }
  req.user = payload;
  next();
};
