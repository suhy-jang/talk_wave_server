const {
  handleTyping,
  handleStopTyping,
  handleSendMessage,
  handleDisconnect,
  handleJoinChannel,
  handleLeaveChannel,
  handleSyncSubscriptions,
} = require('./handlers/messageHandlers');
const authenticateSocket = require('./middlewares/authenticateSocket');
const errorHandler = require('./middlewares/errorHandler');
const guardRun = require('./handlers/guardRun');

module.exports = function (io) {
  io.use(authenticateSocket);
  io.use(errorHandler);

  io.on('connection', (socket) => {
    socket.on('joinChannel', async (data) => {
      guardRun(() => handleJoinChannel(socket, data), { socket });
    });

    socket.on('leaveChannel', () => {
      guardRun(() => handleLeaveChannel(socket), { socket });
    });

    socket.on('typing', () => {
      guardRun(() => handleTyping(socket), { socket });
    });

    socket.on('stopTyping', () => {
      guardRun(() => handleStopTyping(socket), { socket });
    });

    socket.on('sendMessage', async (data) => {
      guardRun(() => handleSendMessage(socket, data), { socket });
    });

    socket.on('disconnect', () => {
      guardRun(() => handleDisconnect(socket), { socket });
    });

    socket.on('syncSubscriptions', (data) => {
      guardRun(() => handleSyncSubscriptions(socket, data), { socket });
    });
  });
};
