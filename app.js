require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const mainRouter = require('./routes');
const processAppErrors = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { mongoUri, port } = require('./utils/config');

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(
  cors({
    origin: 'https://karina.movie.students.nomoredomains.monster',
    credentials: true,
    allowedHeaders: 'cookie,content-type',
  }),
);

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(cookieParser());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(mainRouter);

app.use(errors());

app.use(processAppErrors);

app.use(errorLogger);

app.listen(port);
