const express = require('express');

const router = express.Router();

const usersRouter = require('./users');
const moviesRouter = require('./movies');

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

module.exports = router;
