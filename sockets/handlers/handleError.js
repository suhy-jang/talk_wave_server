const devLog = require('../../utils/loggers');

const handleError = (socket, error) => {
  devLog('Caught socket error', error);
  socket.emit('error', 'An unexpected error occurred.');
};

const guardRun = ({ handler, props }) => {
  try {
    return handler(props);
  } catch (error) {
    handleError(props.socket, error);
  }
};

module.exports = { handleError, guardRun };
