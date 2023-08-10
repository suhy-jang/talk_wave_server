const logger = require('../../utils/loggers');

const handleTyping = ({ socket, message }) => {
  logger('user is typing');
  socket.broadcast.emit('userTyping', message);
};

const handleStopTyping = ({ socket, message }) => {
  logger('user stopped typing');
  socket.broadcast.emit('userStoppedTyping', message);
};

const handleSendMessage = ({ io, message }) => {
  logger(`send message: ${message}`);
  io.emit('receiveMessage', message);
};

const handleDisconnect = ({ socket }) => {
  logger('User disconnected', socket.id);

  socket.broadcast.emit('userLeft', `${socket.id} has left the chat!`);
};

module.exports = {
  handleTyping,
  handleStopTyping,
  handleSendMessage,
  handleDisconnect,
};
