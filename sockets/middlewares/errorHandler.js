const logger = require('../../utils/loggers');

const errorHandler = (socket, next) => {
  socket.on('error', (error) => {
    logger.error('Caught socket error', error);
    if (socket) {
      socket.emit('error', 'An unexpected error occurred.');
    }
  });

  next();
};

module.exports = errorHandler;
