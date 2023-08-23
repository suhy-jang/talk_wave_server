const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');
const { Message, PrivateSubscription } = require('../../models');
const logger = require('../../utils/loggers');

const handleTyping = (socket) => {
  const { channel } = socket.userData || {};
  logger.debug('handleTyping');
  socket.to(channel).emit('userTyping');
};

const handleStopTyping = (socket) => {
  const { channel } = socket.userData || {};
  logger.debug('handleStopTyping');
  socket.to(channel).emit('userStoppedTyping');
};

const handleSendMessage = async (socket, data) => {
  const schema = Joi.object({
    content: Joi.string().required(),
  });
  const { error } = schema.validate(data);
  if (error) {
    throw new Error('Invalid message format');
  }
  data.content = sanitizeHtml(data.content, {
    allowedTags: [],
    allowedAttributes: {},
  });
  const { channel } = socket.userData || {};
  const newMessage = new Message({
    content: data.content,
    creator: socket.user.userId,
    channel,
  });
  const savedMessage = await newMessage.save();

  const foundMessage = await savedMessage.populate({
    path: 'creator',
    select: '_id name',
  });
  logger.debug('handleSendMessage');
  socket.emit('receiveMessage', foundMessage);
  socket.to(channel).emit('receiveMessage', foundMessage);
};

const handleDisconnect = async (socket) => {
  const { userName, channel } = socket.userData || {};
  delete socket.userData;
  socket.leave(channel);
  logger.debug('handleDisconnect');
  socket.to(channel).emit('userLeft', `${userName} has left the chat!`);
};

const handleJoinChannel = async (socket, data) => {
  const schema = Joi.object({
    userName: Joi.string().required(),
    channel: Joi.string().required(),
  });
  const { error } = schema.validate(data);
  if (error) {
    throw new Error('Invalid message format');
  }
  const { userName, channel } = data;
  socket.userData = { userName, channel };
  logger.debug('handleJoinChannel');
  socket.join(channel);
  socket.to(channel).emit('userJoined', `${userName} has joined the chat!`);
};

const handleLeaveChannel = async (socket) => {
  const { userName, channel } = socket.userData || {};
  delete socket.userData;
  socket.leave(channel);
  logger.debug('handleLeaveChannel');
  socket.to(channel).emit('userLeft', `${userName} has left the chat!`);
};

const handleSyncSubscriptions = async (socket, data) => {
  const { channel } = socket.userData;
  const subscriptions = await PrivateSubscription.find({
    channel,
  })
    .select('subscriber')
    .populate({
      path: 'subscriber',
      select: '_id name',
    });

  const subscribers = subscriptions.map(
    (subscription) => subscription.subscriber
  );
  logger.debug('handleSyncSubscriptions');
  socket.to(channel).emit('subscribers', { subscribers });
};

module.exports = {
  handleTyping,
  handleStopTyping,
  handleSendMessage,
  handleDisconnect,
  handleJoinChannel,
  handleLeaveChannel,
  handleSyncSubscriptions,
};
