const express = require('express');
const { celebrate, Joi } = require('celebrate');

const router = express.Router();

const {
  createMovie,
  findAll,
  deleteById,
} = require('../controllers/movies');

const linkValidator = require('../utils/linkValidator');

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().custom(linkValidator, 'custom URL validation'),
      trailer: Joi.string().required().custom(linkValidator, 'custom URL validation'),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      thumbnail: Joi.string().required().custom(linkValidator, 'custom URL validation'),
      movieId: Joi.number().required(),
    }),
  }),
  createMovie,
);
router.get('/', findAll);
router.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex(),
    }),
  }),
  deleteById,
);

module.exports = router;
