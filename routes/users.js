const express = require('express');
const { celebrate, Joi } = require('celebrate');
const linkValidator = require('../utils/linkValidator');

const router = express.Router();

const {
  changeProfile,
  findCurrentUser,
} = require('../controllers/users');

router.get('/me', findCurrentUser);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().custom(linkValidator, 'custom URL validation'),
    }),
  }),
  changeProfile,
);

module.exports = router;
