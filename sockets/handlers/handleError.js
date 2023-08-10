const logger = require('../../utils/loggers');

const handleError = (socket, error) => {
  logger.error('Caught socket error', error);
  if (socket) {
    socket.emit('error', 'An unexpected error occurred.');
  }
};

const guardRun = ({ handler, props }) => {
  try {
    return handler(props);
  } catch (error) {
    handleError(props.socket, error);
  }
};

module.exports = { handleError, guardRun };
