const logger = require('../utils/loggers');

const guardRun = (handler) => async (req, res, next) => {
  try {
    return await handler(req, res, next);
  } catch (error) {
    logger.error('Caught error', error.message);
    next(error);
  }
};

module.exports = guardRun;
