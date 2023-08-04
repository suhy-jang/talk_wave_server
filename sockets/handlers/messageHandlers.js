const devLog = require('../../utils/loggers');

const handleTyping = ({ socket, message }) => {
  devLog('user is typing');
  socket.broadcast.emit('userTyping', message);
};

const handleStopTyping = ({ socket, message }) => {
  devLog('user stopped typing');
  socket.broadcast.emit('userStoppedTyping', message);
};

const handleSendMessage = ({ io, message }) => {
  devLog(`send message: ${message}`);
  io.emit('receiveMessage', message);
};

const handleDisconnect = ({ socket }) => {
  devLog('User disconnected', socket.id);

  socket.broadcast.emit('userLeft', `${socket.id} has left the chat!`);
};

module.exports = {
  handleTyping,
  handleStopTyping,
  handleSendMessage,
  handleDisconnect,
};
