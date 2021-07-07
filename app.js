require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors, Joi, celebrate } = require('celebrate');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const NotFoundError = require('./errors/not-found-err');
const { INTERNAL_SERVER_ERROR } = require('./utils/error-codes');
const { login, createUser, logout } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(helmet());
app.use(
  cors({
    origin: 'https://karina.movie.students.nomoredomains.monster',
    credentials: true,
    allowedHeaders: 'cookie,content-type',
  }),
);

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);
app.post('/signout', logout);
app.use(cookieParser());
app.use(auth);

app.use(usersRouter);
app.use(moviesRouter);
app.use(errorLogger);
app.use((req, res, next) => {
  next(new NotFoundError('Адрес не существует'));
});
app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res
    .status(err.statusCode || INTERNAL_SERVER_ERROR)
    .send({ message: err.message });
});

app.listen(PORT);
