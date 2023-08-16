const { Message } = require('../../models');

const handleTyping = (socket) => {
  const { channel } = socket.userData || {};
  socket.to(channel).emit('userTyping');
};

const handleStopTyping = (socket) => {
  const { channel } = socket.userData || {};
  socket.to(channel).emit('userStoppedTyping');
};

const handleSendMessage = async (socket, { content }) => {
  const { channel } = socket.userData || {};
  const newMessage = new Message({
    content,
    creator: socket.user.userId,
    channel,
  });
  const savedMessage = await newMessage.save();

  const foundMessage = await savedMessage.populate({
    path: 'creator',
    select: '_id name',
  });
  socket.emit('receiveMessage', foundMessage);
  socket.to(channel).emit('receiveMessage', foundMessage);
};

const handleDisconnect = async (socket) => {
  const { userName, channel } = socket.userData || {};
  delete socket.userData;
  socket.to(channel).emit('userLeft', `${userName} has left the chat!`);
};

const handleJoinChannel = async (socket, { userName, channel }) => {
  socket.userData = { userName, channel };
  socket.join(channel);
  socket.to(channel).emit('userJoined', `${userName} has joined the chat!`);
};

const handleLeaveChannel = async (socket) => {
  const { userName, channel } = socket.userData || {};
  delete socket.userData;
  socket.to(channel).emit('userLeft', `${userName} has left the chat!`);
};

module.exports = {
  handleTyping,
  handleStopTyping,
  handleSendMessage,
  handleDisconnect,
  handleJoinChannel,
  handleLeaveChannel,
};
