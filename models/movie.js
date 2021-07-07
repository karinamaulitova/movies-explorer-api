const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    validate: {
      validator(str) {
        return validator.isURL(str, {
          protocols: ['http', 'https'],
          require_protocol: true,
        });
      },
      message: (props) => `${props.value} is not a valid link!`,
    },
    required: true,
  },
  trailer: {
    type: String,
    validate: {
      validator(str) {
        return validator.isURL(str, {
          protocols: ['http', 'https'],
          require_protocol: true,
        });
      },
      message: (props) => `${props.value} is not a valid link!`,
    },
    required: true,
  },
  thumbnail: {
    type: String,
    validate: {
      validator(str) {
        return validator.isURL(str, {
          protocols: ['http', 'https'],
          require_protocol: true,
        });
      },
      message: (props) => `${props.value} is not a valid link!`,
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRu: {
    type: String,
    required: true,
  },
  nameEn: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);