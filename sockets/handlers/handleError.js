const handleError = (socket, error) => {
  console.error('Caught socket error', error);
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
