const { validationResult } = require('express-validator');

const validationRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Returns an array of objects containing key-value pairs such as
    // type, value, msg, path, and location
    // to detail the validation errors.

    return res.status(400).json({
      errors: errors.array().map(({ path, value, msg }) => ({
        msg: `'${path}' with value '${value}' has '${msg}' error`,
      })),
    });
  }
  next();
};

module.exports = validationRequest;
