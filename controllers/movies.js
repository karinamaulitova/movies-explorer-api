const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const RequestError = require('../errors/request-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    id,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId: id,
    owner: req.user._id,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new RequestError(
            `Переданы некорректные данные при создании карточки: ${err.message}`,
          ),
        );
      } else {
        next(new Error('Ошибка по умолчанию'));
      }
    });
};

module.exports.findAll = (req, res, next) => {
  Movie.find()
    .then((cards) => res.send({ data: cards }))
    .catch(() => next(new Error('Ошибка по умолчанию')));
};

module.exports.deleteById = async (req, res, next) => {
  const { movieId } = req.params;
  const { _id: currentUserId } = req.user;
  try {
    const movie = await Movie.findOne({ movieId }).orFail(new Error('NotFound'));

    if (!movie.owner.equals(currentUserId)) {
      next(new ForbiddenError('Доступ запрещен'));
      return;
    }

    await movie.remove();
    res.send({ data: movie });
  } catch (err) {
    if (err.message === 'NotFound') {
      next(new NotFoundError('Карточка с указанным movieId не найдена'));
    } else if (err.name === 'CastError') {
      next(
        new RequestError('Переданы некорректные данные при удалении карточки'),
      );
    } else {
      next(new Error('Ошибка по умолчанию'));
    }
  }
};
