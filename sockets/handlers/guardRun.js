const logger = require('../../utils/loggers');

const guardRun = (handler, context = {}) => {
  try {
    return handler();
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`);
    if (context && context.socket) {
      context.socket.emit(
        'error',
        'An error occurred while processing your request.'
      );
    }
  }
};

module.exports = guardRun;
