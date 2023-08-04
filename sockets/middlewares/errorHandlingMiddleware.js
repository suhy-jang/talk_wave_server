module.exports = (socket, next) => {
  socket.on('error', (error) => {
    console.error('Caught socket error', error);
  });

  next();
};
