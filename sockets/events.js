const {
  handleTyping,
  handleStopTyping,
  handleSendMessage,
  handleDisconnect,
} = require('./handlers/messageHandlers');
const authenticateSocket = require('./middlewares/authenticateSocket');
const errorHandler = require('./middlewares/errorHandler');
const guardRun = require('./handlers/guardRun');
const logger = require('../utils/loggers');

module.exports = function (io) {
  io.use(authenticateSocket);
  io.use(errorHandler);

  io.on('connection', (socket) => {
    logger.info('User connected', socket.id);

    // TODO: Use user ID instead of socket ID
    socket.broadcast.emit('userJoined', `${socket.id} has joined the chat!`);

    socket.on('typing', (message) =>
      guardRun(() => handleTyping({ socket, message }), { socket })
    );

    socket.on('stopTyping', (message) =>
      guardRun(() => handleStopTyping({ socket, message }), { socket })
    );

    socket.on('sendMessage', (message) =>
      guardRun(() => handleSendMessage({ io, socket, message }), { socket })
    );

    socket.on('disconnect', () =>
      guardRun(() => handleDisconnect({ socket }), { socket })
    );
  });
};
