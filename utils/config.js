const {
  NODE_ENV, JWT_SECRET, MONGO_URI, PORT,
} = process.env;
const jwtSecret = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
const mongoUri = NODE_ENV === 'production' ? MONGO_URI : 'mongodb://localhost:27017/bitfilmsdb';
const port = PORT || 3000;

module.exports = {
  jwtSecret,
  mongoUri,
  port,
};
