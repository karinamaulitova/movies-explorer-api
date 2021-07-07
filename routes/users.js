const express = require('express');
const { celebrate, Joi } = require('celebrate');

const router = express.Router();

const {
  changeProfile,
  findCurrentUser,
} = require('../controllers/users');

router.get('/users/me', findCurrentUser);
router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
    }),
  }),
  changeProfile,
);

module.exports = router;
