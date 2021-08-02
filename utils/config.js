const {
  NODE_ENV, JWT_SECRET, MONGO_URI, PORT,
} = process.env;
const isProduction = NODE_ENV === 'production';
const jwtSecret = isProduction ? JWT_SECRET : 'dev-secret';
const mongoUri = isProduction ? MONGO_URI : 'mongodb://localhost:27017/bitfilmsdb';
const port = PORT || 3000;

module.exports = {
  jwtSecret,
  mongoUri,
  port,
  isProduction,
};
