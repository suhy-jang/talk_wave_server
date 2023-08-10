const {
  handleTyping,
  handleStopTyping,
  handleSendMessage,
  handleDisconnect,
} = require('./handlers/messageHandlers');
const errorHandler = require('./middlewares/errorHandler');
const { guardRun } = require('./handlers/handleError');
const logger = require('../utils/loggers');

module.exports = function (io) {
  io.use(errorHandler);

  io.on('connection', (socket) => {
    logger.info('User connected', socket.id);

    socket.broadcast.emit('userJoined', `${socket.id} has joined the chat!`);

    socket.on('typing', (message) =>
      guardRun({ handler: handleTyping, props: { socket, message } })
    );

    socket.on('stopTyping', (message) =>
      guardRun({
        handler: handleStopTyping,
        props: { socket, message },
      })
    );

    socket.on('sendMessage', (message) =>
      guardRun({
        handler: handleSendMessage,
        props: { io, message },
      })
    );

    socket.on('disconnect', () =>
      guardRun({ handler: handleDisconnect, props: { socket } })
    );
  });
};
