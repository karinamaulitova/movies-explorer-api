const validator = require('validator');

const linkValidator = (value) => {
  if (!validator.isURL(value)) {
    throw new Error('Invalid URL');
  }
  return value;
};

module.exports = linkValidator;
