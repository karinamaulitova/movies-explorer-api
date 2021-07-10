const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const RequestError = require('../errors/request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');
const { jwtSecret } = require('../utils/config');

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      const { password: _, ...publicUser } = user.toObject();
      res.send({ data: publicUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new RequestError(
            'Переданы некорректные данные при создании пользователя',
          ),
        );
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(
          new ConflictError('Пользователь с таким email уже зарегистрирован'),
        );
      } else {
        next(new Error('Ошибка по умолчанию'));
      }
    });
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Неправильные почта или пароль');
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      throw new Error('Неправильные почта или пароль');
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      jwtSecret,
    );
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
    });
    res.status(201).send({ success: true });
    res.end();
  } catch (err) {
    next(new UnauthorizedError('Пользователь неавторизован'));
  }
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).send({ success: true });
  res.end();
};

module.exports.findCurrentUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const currentUser = await User.findById(_id);
    res.send(currentUser);
  } catch (err) {
    next(new Error('Ошибка по умолчанию'));
  }
};

module.exports.changeProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true, omitUndefined: true },
  )
    .orFail(new Error('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else if (err.name === 'ValidationError') {
        next(
          new RequestError(
            'Переданы некорректные данные при обновлении профиля',
          ),
        );
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(
          new ConflictError('Пользователь с таким email уже зарегистрирован'),
        );
      } else {
        next(new Error('Ошибка по умолчанию'));
      }
    });
};
