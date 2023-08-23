const logger = require('../../utils/loggers');

const guardRun = async (handler, context = {}) => {
  try {
    return await handler();
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
