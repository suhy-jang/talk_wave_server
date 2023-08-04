const {
  handleTyping,
  handleStopTyping,
  handleSendMessage,
  handleDisconnect,
} = require('./handlers/messageHandlers');
const errorHandlingMiddleware = require('./middlewares/errorHandlingMiddleware');

module.exports = function (io) {
  io.use(errorHandlingMiddleware);

  io.on('connection', (socket) => {
    console.log('User connected', socket.id);

    socket.broadcast.emit('userJoined', `${socket.id} has joined the chat!`);

    socket.on('typing', (message) => handleTyping({ socket, message }));

    socket.on('stopTyping', (message) => handleStopTyping({ socket, message }));

    socket.on('sendMessage', (message) =>
      handleSendMessage({ io, socket, message })
    );

    socket.on('disconnect', (message) => handleDisconnect({ socket, message }));
  });
};
