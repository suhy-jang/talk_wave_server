const { Message, User } = require('../../models');
const logger = require('../../utils/loggers');

const handleTyping = ({ socket, message }) => {
  logger.debug('user is typing');
  socket.broadcast.emit('userTyping', message);
};

const handleStopTyping = ({ socket, message }) => {
  logger.debug('user stopped typing');
  socket.broadcast.emit('userStoppedTyping', message);
};

const handleSendMessage = async ({ io, socket, message }) => {
  const { content, channel } = message;
  logger.debug(`send message: ${message}`);
  const user = await User.findOne({ _id: socket.user.userId });
  const newMessage = new Message({
    content,
    creator: user._id,
    channel,
  });
  await newMessage.save();
  io.emit('receiveMessage', message.content);
};

const handleDisconnect = ({ socket }) => {
  logger.debug('User disconnected', socket.id);

  socket.broadcast.emit('userLeft', `${socket.id} has left the chat!`);
};

module.exports = {
  handleTyping,
  handleStopTyping,
  handleSendMessage,
  handleDisconnect,
};
