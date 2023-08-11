const logger = require('../utils/loggers');

// Handle 405 Method Not Allowed
const methodNotAllowed = (req, res, next) => {
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE']; // Specify allowed methods here
  if (allowedMethods.indexOf(req.method) === -1) {
    return res.status(405).json({ errors: [{ msg: 'Method Not Allowed' }] });
  }
  next();
};

// Handle 404 Not Found
const routeNotFound = (req, res, next) => {
  res.status(404).json({ errors: [{ msg: 'Route Not Found' }] });
};

// Handle 500 Server Error
const serverInternalError = (err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send({ errors: [{ msg: err.message }] });
};

module.exports = { methodNotAllowed, routeNotFound, serverInternalError };
