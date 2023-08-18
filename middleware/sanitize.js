const sanitizeHtml = require('sanitize-html');
const logger = require('../utils/loggers');

const sanitize = (fieldsToSanitize) => (req, res, next) => {
  let sanitizedBody = {};

  fieldsToSanitize.forEach((field) => {
    if (req.body[field]) {
      sanitizedBody[field] = sanitizeHtml(req.body[field], {
        allowedTags: [],
        allowedAttributes: {},
      });
    }
  });

  req.body = { ...req.body, ...sanitizedBody };

  next();
};

module.exports = sanitize;
