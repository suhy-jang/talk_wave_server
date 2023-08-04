module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log('User connected', socket.id);

    socket.broadcast.emit('userJoined', `${socket.id} has joined the chat!`);

    socket.on('typing', (message) => {
      // console.log('user is typing');
      socket.broadcast.emit('userTyping', message);
    });

    socket.on('stopTyping', (message) => {
      // console.log('user stopped typing');
      socket.broadcast.emit('userStoppedTyping', message);
      // socket.disconnect(true);
    });

    socket.on('sendMessage', (message, callback) => {
      // console.log(`send message: ${message}`);
      try {
        io.emit('receiveMessage', message);

        // callback({
        //   error: 'An error occurred while sending the message.',
        // });
      } catch (error) {
        console.error('Error in sendMessage', error);
        callback({
          error: 'An unexpected error occurred.',
        });
      }
    });

    socket.on('disconnect', () => {
      // console.log('User disconnected', socket.id);

      socket.broadcast.emit('userLeft', `${socket.id} has left the chat!`);
    });
  });
};
