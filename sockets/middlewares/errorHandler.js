const { handleError } = require('../handlers/handleError');

module.exports = (socket, next) => {
  socket.on('error', (error) => {
    handleError(socket, error);
  });

  next();
};
