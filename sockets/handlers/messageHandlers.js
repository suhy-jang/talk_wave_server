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

  const foundMessage = await Message.findOne({ _id: newMessage._id })
    .select('content timestamp creator')
    .populate({
      path: 'creator',
      select: '_id name',
    });
  io.emit('receiveMessage', foundMessage);
};

const handleDisconnect = async ({ socket }) => {
  const userId = socket.user.userId;
  logger.info('User disconnected', userId);

  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new Error('User not found');
  }

  socket.broadcast.emit('userLeft', `${user.name} has left the chat!`);
};

module.exports = {
  handleTyping,
  handleStopTyping,
  handleSendMessage,
  handleDisconnect,
};
