const handleTyping = ({ socket, message }) => {
  // console.log('user is typing');
  socket.broadcast.emit('userTyping', message);
};

const handleStopTyping = ({ socket, message }) => {
  // console.log('user stopped typing');
  socket.broadcast.emit('userStoppedTyping', message);
  // socket.disconnect(true);
};

const handleSendMessage = ({ io, socket, message }) => {
  // console.log(`send message: ${message}`);
  try {
    io.emit('receiveMessage', message);

    // callback({
    //   error: 'An error occurred while sending the message.',
    // });
  } catch (error) {
    console.error('Error in sendMessage', error);
    socket.emit('error', 'An unexpected error occurred.');
    // callback({
    //   error: 'An unexpected error occurred.',
    // });
  }
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
