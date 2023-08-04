const handleTyping = ({ socket, message }) => {
  // console.log('user is typing');
  socket.broadcast.emit('userTyping', message);
};

const handleStopTyping = ({ socket, message }) => {
  // console.log('user stopped typing');
  socket.broadcast.emit('userStoppedTyping', message);
  // socket.disconnect(true);
};

const handleSendMessage = ({ io, message }) => {
  console.log(`send message: ${message}`);
  io.emit('receiveMessage', message);
};

const handleDisconnect = ({ socket }) => {
  // console.log('User disconnected', socket.id);

  socket.broadcast.emit('userLeft', `${socket.id} has left the chat!`);
};

module.exports = {
  handleTyping,
  handleStopTyping,
  handleSendMessage,
  handleDisconnect,
};
