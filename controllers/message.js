const { Message, User } = require('../models');

exports.getMessagesByChannel = async (req, res) => {
  const { channelId } = req.params;
  const messages = await Message.find({ channel: channelId }).populate(
    'creator'
  );

  if (!messages) {
    return res.status(404).json({ errors: [{ msg: 'Message not found' }] });
  }
  res.status(200).json({ messages });
};
